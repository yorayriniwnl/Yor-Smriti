/**
 * Unit tests for lib/rateLimiter.ts
 *
 * Strategy: mock the upstash module so we can simulate Upstash being
 * available / unavailable without real network calls, then verify the
 * allow / block / reset logic of checkAndRecordRateLimit().
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─── Mock upstash ─────────────────────────────────────────────────────────────

// We need to set up the mock before importing rateLimiter, because rateLimiter
// calls getUpstashConfig() at the module level indirectly through the function.
vi.mock('../upstash', () => {
  return {
    getUpstashConfig: vi.fn(),
    upstashCmd: vi.fn(),
    upstashPipeline: vi.fn(),
  };
});

import { getUpstashConfig, upstashPipeline } from '../upstash';
import { checkAndRecordRateLimit } from '../rateLimiter';

const mockGetUpstashConfig = vi.mocked(getUpstashConfig);
const mockUpstashPipeline = vi.mocked(upstashPipeline);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a fake upstash pipeline result simulating an INCR + EXPIRE + TTL. */
function pipelineResult(count: number, ttlSec = 60) {
  return [
    { result: count },
    { result: 1 },
    { result: ttlSec },
  ];
}

// ─── Tests: Upstash path ─────────────────────────────────────────────────────

describe('checkAndRecordRateLimit — Upstash backend', () => {
  const fakeCfg = { url: 'https://fake.upstash.io', token: 'tok' };

  beforeEach(() => {
    mockGetUpstashConfig.mockReturnValue(fakeCfg);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows request when count is within limit', async () => {
    mockUpstashPipeline.mockResolvedValueOnce(pipelineResult(1));
    const result = await checkAndRecordRateLimit('test:ip', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('allows request exactly at limit', async () => {
    mockUpstashPipeline.mockResolvedValueOnce(pipelineResult(5));
    const result = await checkAndRecordRateLimit('test:ip', 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('blocks request when count exceeds limit', async () => {
    mockUpstashPipeline.mockResolvedValueOnce(pipelineResult(6));
    const result = await checkAndRecordRateLimit('test:ip', 5, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('returns a resetMs in the future', async () => {
    const before = Date.now();
    mockUpstashPipeline.mockResolvedValueOnce(pipelineResult(1, 30));
    const result = await checkAndRecordRateLimit('test:ip', 5, 60_000);
    expect(result.resetMs).toBeGreaterThanOrEqual(before);
  });

  it('falls through to in-memory on Upstash error', async () => {
    mockUpstashPipeline.mockRejectedValueOnce(new Error('network error'));
    // After fallback the request should still be allowed (first hit)
    const result = await checkAndRecordRateLimit(`fallback:${Math.random()}`, 5, 60_000);
    expect(result.allowed).toBe(true);
  });
});

// ─── Tests: In-memory fallback ────────────────────────────────────────────────

describe('checkAndRecordRateLimit — in-memory fallback', () => {
  beforeEach(() => {
    // No Upstash configured → forces in-memory path
    mockGetUpstashConfig.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('allows the first request', async () => {
    const key = `mem:${Math.random()}`;
    const result = await checkAndRecordRateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(true);
  });

  it('blocks when limit is exceeded', async () => {
    const key = `mem:${Math.random()}`;
    const limit = 2;
    await checkAndRecordRateLimit(key, limit, 60_000); // 1
    await checkAndRecordRateLimit(key, limit, 60_000); // 2
    const result = await checkAndRecordRateLimit(key, limit, 60_000); // 3 → blocked
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after the window expires', async () => {
    const key = `mem:${Math.random()}`;
    const limit = 1;
    await checkAndRecordRateLimit(key, limit, 1); // window = 1ms
    // Wait for the 1ms window to expire
    await new Promise((r) => setTimeout(r, 5));
    const result = await checkAndRecordRateLimit(key, limit, 1);
    expect(result.allowed).toBe(true);
  });
});
