import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/metrics', () => ({
  incMetric: vi.fn(),
}));

import { POST } from './route';

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/logout', {
    method: 'POST',
    headers,
  });
}

beforeEach(() => {
  (process.env as Record<string, string>).NODE_ENV = 'production';
});

afterEach(() => {
  (process.env as Record<string, string>).NODE_ENV = 'test';
  vi.clearAllMocks();
});

describe('POST /api/logout', () => {
  it('rejects requests without CSRF proof', async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(403);
  });

  it('clears the session cookie when CSRF proof is present', async () => {
    const res = await POST(makeRequest({ 'x-yor-csrf': '1' }));
    expect(res.status).toBe(200);
    expect(res.headers.get('set-cookie')).toContain('yor_session=');
    expect(res.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
