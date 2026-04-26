import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SessionPayload } from '@/lib/auth';

vi.mock('@/lib/auth', () => ({
  getTokenFromRequest: vi.fn(),
  verifySession: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
  getReplyEntries: vi.fn(),
}));

import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getReplyEntries } from '@/lib/db';
import { GET } from './route';

const mockGetToken = vi.mocked(getTokenFromRequest);
const mockVerify = vi.mocked(verifySession);
const mockGetReplyEntries = vi.mocked(getReplyEntries);

function session(sub: string): SessionPayload {
  const now = Math.floor(Date.now() / 1000);
  return { sub, iat: now, exp: now + 60 };
}

function makeRequest(url = 'http://localhost/api/reply/entries'): Request {
  return new Request(url);
}

beforeEach(() => {
  delete process.env.APP_USERNAME;
  vi.clearAllMocks();
});

afterEach(() => {
  delete process.env.APP_USERNAME;
});

describe('GET /api/reply/entries', () => {
  it('requires authentication', async () => {
    mockGetToken.mockReturnValue(null);
    mockVerify.mockReturnValue(null);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it('rejects guest sessions', async () => {
    mockGetToken.mockReturnValue('guest-token');
    mockVerify.mockReturnValue(session('guest'));

    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it('rejects non-admin users when APP_USERNAME is configured', async () => {
    process.env.APP_USERNAME = 'alice';
    mockGetToken.mockReturnValue('bob-token');
    mockVerify.mockReturnValue(session('bob'));

    const res = await GET(makeRequest());
    expect(res.status).toBe(403);
  });

  it('returns sanitized entries for the configured admin', async () => {
    process.env.APP_USERNAME = 'alice';
    mockGetToken.mockReturnValue('alice-token');
    mockVerify.mockReturnValue(session('alice'));
    mockGetReplyEntries.mockResolvedValue([
      {
        id: 'reply_1',
        mood: 'yes',
        message: 'hello',
        createdAt: '2026-04-26T00:00:00.000Z',
        ip: '203.0.113.5',
      },
    ]);

    const res = await GET(makeRequest('http://localhost/api/reply/entries?limit=1'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entries).toEqual([
      { mood: 'yes', message: 'hello', createdAt: '2026-04-26T00:00:00.000Z' },
    ]);
    expect(JSON.stringify(body)).not.toContain('203.0.113.5');
  });

  it('falls back to a safe default for malformed limits', async () => {
    process.env.APP_USERNAME = 'alice';
    mockGetToken.mockReturnValue('alice-token');
    mockVerify.mockReturnValue(session('alice'));
    mockGetReplyEntries.mockResolvedValue([]);

    await GET(makeRequest('http://localhost/api/reply/entries?limit=not-a-number'));
    expect(mockGetReplyEntries).toHaveBeenCalledWith(50);
  });
});
