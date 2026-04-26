import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { signSession } from '@/lib/auth';
import { HER_UNLOCK_COOKIE, verifyHerUnlockToken } from '@/lib/unlock';

vi.mock('@/lib/rateLimiter', () => ({
  checkAndRecordRateLimit: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { POST } from './route';

const mockRateLimit = vi.mocked(checkAndRecordRateLimit);

function makeRequest(password: string, sessionToken?: string): Request {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-yor-csrf': '1',
  };
  if (sessionToken) headers.cookie = `yor_session=${encodeURIComponent(sessionToken)}`;

  return new Request('http://localhost/api/her-unlock', {
    method: 'POST',
    headers,
    body: JSON.stringify({ password }),
  });
}

function getCookieValue(setCookie: string, name: string): string | null {
  const match = setCookie.match(new RegExp(`(?:^|,\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

beforeEach(() => {
  process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
  process.env.HER_UNLOCK_PASSWORD = 'open-sesame';
  (process.env as Record<string, string>).NODE_ENV = 'test';
  mockRateLimit.mockResolvedValue({ allowed: true, remaining: 9, resetMs: Date.now() + 60_000 });
});

afterEach(() => {
  delete process.env.HER_UNLOCK_PASSWORD;
  vi.clearAllMocks();
});

describe('POST /api/her-unlock', () => {
  it('requires a valid session before checking the password', async () => {
    const res = await POST(makeRequest('open-sesame'));
    expect(res.status).toBe(401);
  });

  it('rejects an incorrect password', async () => {
    const res = await POST(makeRequest('wrong', signSession('alice')));
    expect(res.status).toBe(401);
  });

  it('sets a signed unlock cookie for the private content route', async () => {
    const res = await POST(makeRequest('open-sesame', signSession('alice')));
    expect(res.status).toBe(200);

    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toContain(`${HER_UNLOCK_COOKIE}=`);
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Path=/for-her-alone/content');

    const token = getCookieValue(setCookie, HER_UNLOCK_COOKIE);
    expect(token).not.toBe('1');
    expect(verifyHerUnlockToken(token)).toBe(true);
  });

  it('does not accept the old forgeable literal value', () => {
    expect(verifyHerUnlockToken('1')).toBe(false);
  });
});
