/**
 * Unit tests for app/api/login/route.ts
 *
 * Covers:
 * - Open-access mode (no APP_USERNAME / APP_PASSWORD set)
 * - Credential-gated mode: valid and invalid credentials
 * - Rate-limit blocking (429)
 * - CSRF rejection (403)
 * - Invalid JSON body (400)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock heavy dependencies ──────────────────────────────────────────────────

vi.mock('@/lib/rateLimiter', () => ({
  checkAndRecordRateLimit: vi.fn(),
}));

vi.mock('@/lib/metrics', () => ({
  incMetric: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { checkAndRecordRateLimit } from '@/lib/rateLimiter';

const mockRateLimit = vi.mocked(checkAndRecordRateLimit);

// Default: always allow
function allowRateLimit() {
  mockRateLimit.mockResolvedValue({ allowed: true, remaining: 9, resetMs: Date.now() + 60_000 });
}

function blockRateLimit() {
  mockRateLimit.mockResolvedValue({ allowed: false, remaining: 0, resetMs: Date.now() + 30_000 });
}

// ─── Request helpers ──────────────────────────────────────────────────────────

function makeLoginRequest(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
): Request {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-yor-csrf': '1',   // pass CSRF by default
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeBadJsonRequest(): Request {
  return new Request('http://localhost/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-yor-csrf': '1' },
    body: 'not json',
  });
}

// ─── Import route after mocks ─────────────────────────────────────────────────

// Import dynamically so module-level env reads pick up our beforeEach values.
async function getRoute() {
  vi.resetModules();
  const mod = await import('@/app/api/login/route');
  return mod.POST;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/login — open-access mode', () => {
  beforeEach(() => {
    delete process.env.APP_USERNAME;
    delete process.env.APP_PASSWORD;
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
    (process.env as Record<string, string>).NODE_ENV = 'test';
    allowRateLimit();
  });

  afterEach(() => { vi.clearAllMocks(); });

  it('returns 200 and sets a session cookie without credentials', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({});
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.user).toBe('guest');
    expect(res.headers.get('set-cookie')).toContain('yor_session=');
  });

  it('ignores any supplied credentials in open-access mode', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({ username: 'hacker', password: 'wrong' });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });
});

describe('POST /api/login — credential-gated mode', () => {
  beforeEach(() => {
    process.env.APP_USERNAME = 'alice';
    process.env.APP_PASSWORD = 'secret123';
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
    (process.env as Record<string, string>).NODE_ENV = 'test';
    allowRateLimit();
  });

  afterEach(() => {
    delete process.env.APP_USERNAME;
    delete process.env.APP_PASSWORD;
    vi.clearAllMocks();
  });

  it('returns 200 with valid credentials', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({ username: 'alice', password: 'secret123' });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(res.headers.get('set-cookie')).toContain('yor_session=');
  });

  it('returns 401 with wrong password', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({ username: 'alice', password: 'wrongpassword' });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/invalid/i);
  });

  it('returns 401 with wrong username', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({ username: 'mallory', password: 'secret123' });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});

describe('POST /api/login — rate limiting', () => {
  beforeEach(() => {
    process.env.APP_USERNAME = 'alice';
    process.env.APP_PASSWORD = 'secret123';
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
    (process.env as Record<string, string>).NODE_ENV = 'test';
    blockRateLimit();
  });

  afterEach(() => {
    delete process.env.APP_USERNAME;
    delete process.env.APP_PASSWORD;
    vi.clearAllMocks();
  });

  it('returns 429 when rate limit is exceeded', async () => {
    const POST = await getRoute();
    const req = makeLoginRequest({ username: 'alice', password: 'secret123' });
    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(429);
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/too many/i);
    expect(res.headers.get('retry-after')).toBeDefined();
  });
});

describe('POST /api/login — CSRF protection', () => {
  beforeEach(() => {
    delete process.env.APP_USERNAME;
    delete process.env.APP_PASSWORD;
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
    // NODE_ENV=test bypasses CSRF; use 'production' to test the guard.
    (process.env as Record<string, string>).NODE_ENV = 'production';
    allowRateLimit();
  });

  afterEach(() => {
    (process.env as Record<string, string>).NODE_ENV = 'test';
    vi.clearAllMocks();
  });

  it('returns 403 when the CSRF header is missing', async () => {
    const POST = await getRoute();
    // No x-yor-csrf header, no matching Origin
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('accepts same-origin Origin header as CSRF proof', async () => {
    const POST = await getRoute();
    const req = new Request('http://localhost/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost',
        'Host': 'localhost',
      },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    // Should not be 403 — may be 200 (open access) or 401/429, but not CSRF-rejected
    expect(res.status).not.toBe(403);
  });
});

describe('POST /api/login — malformed body', () => {
  beforeEach(() => {
    delete process.env.APP_USERNAME;
    delete process.env.APP_PASSWORD;
    process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
    (process.env as Record<string, string>).NODE_ENV = 'test';
    allowRateLimit();
  });

  afterEach(() => { vi.clearAllMocks(); });

  it('returns 400 for invalid JSON', async () => {
    const POST = await getRoute();
    const req = makeBadJsonRequest();
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
