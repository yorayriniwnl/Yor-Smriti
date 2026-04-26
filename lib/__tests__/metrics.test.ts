/**
 * Unit tests for lib/metrics.ts
 *
 * Tests that:
 * 1. incMetric increments the in-process cache correctly.
 * 2. getPrometheusMetrics returns well-formed Prometheus text output.
 * 3. Labels are serialised properly.
 * 4. Upstash writes are attempted when configured (and silently ignored on failure).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock upstash so tests never make real network calls ─────────────────────

vi.mock('../upstash', () => ({
  getUpstashConfig: vi.fn(),
  upstashCmd: vi.fn(),
}));

import { getUpstashConfig, upstashCmd } from '../upstash';

const mockGetUpstashConfig = vi.mocked(getUpstashConfig);
const mockUpstashCmd = vi.mocked(upstashCmd);

// Import AFTER mocks are declared so the module picks up the mocked version.
// We re-import dynamically per test group to reset module-level cache state.

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Re-import metrics module with a fresh module registry to reset the cache. */
async function freshMetrics() {
  // vitest module cache reset
  vi.resetModules();
  const mod = await import('../metrics');
  return mod;
}

// ─── incMetric ───────────────────────────────────────────────────────────────

describe('incMetric', () => {
  beforeEach(() => {
    mockGetUpstashConfig.mockReturnValue(null); // no Upstash → in-memory only
    vi.clearAllMocks();
  });

  it('increments a counter in the cache', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('test_counter_a');
    await incMetric('test_counter_a');
    const output = await getPrometheusMetrics();
    expect(output).toContain('test_counter_a 2');
  });

  it('starts from zero and increments by the given amount', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('test_counter_b', undefined, 5);
    const output = await getPrometheusMetrics();
    expect(output).toContain('test_counter_b 5');
  });

  it('accumulates multiple increments', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('test_counter_c', undefined, 3);
    await incMetric('test_counter_c', undefined, 7);
    const output = await getPrometheusMetrics();
    expect(output).toContain('test_counter_c 10');
  });

  it('keeps label variants separate', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('test_labeled', { endpoint: 'a' });
    await incMetric('test_labeled', { endpoint: 'a' });
    await incMetric('test_labeled', { endpoint: 'b' });
    const output = await getPrometheusMetrics();
    expect(output).toContain('test_labeled{endpoint="a"} 2');
    expect(output).toContain('test_labeled{endpoint="b"} 1');
  });

  it('calls upstashCmd when Upstash is configured', async () => {
    const fakeCfg = { url: 'https://fake.upstash.io', token: 'tok' };
    mockGetUpstashConfig.mockReturnValue(fakeCfg);
    mockUpstashCmd.mockResolvedValue(1);

    const { incMetric } = await freshMetrics();
    await incMetric('test_upstash_write');
    expect(mockUpstashCmd).toHaveBeenCalledWith(fakeCfg, 'INCRBYFLOAT', expect.stringContaining('metric:test_upstash_write'), 1);
  });

  it('does not throw when Upstash write fails', async () => {
    const fakeCfg = { url: 'https://fake.upstash.io', token: 'tok' };
    mockGetUpstashConfig.mockReturnValue(fakeCfg);
    mockUpstashCmd.mockRejectedValue(new Error('network'));

    const { incMetric } = await freshMetrics();
    await expect(incMetric('test_upstash_fail')).resolves.toBeUndefined();
  });
});

// ─── getPrometheusMetrics ─────────────────────────────────────────────────────

describe('getPrometheusMetrics', () => {
  beforeEach(() => {
    mockGetUpstashConfig.mockReturnValue(null);
    vi.clearAllMocks();
  });

  it('returns an empty string when no metrics have been recorded', async () => {
    const { getPrometheusMetrics } = await freshMetrics();
    const output = await getPrometheusMetrics();
    expect(output).toBe('');
  });

  it('includes a # TYPE header for each metric family', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('requests_total');
    const output = await getPrometheusMetrics();
    expect(output).toContain('# TYPE requests_total counter');
  });

  it('outputs valid Prometheus text format (no label)', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('simple_metric');
    const output = await getPrometheusMetrics();
    // Each data line: metric_name value
    const lines = output.split('\n').filter(Boolean);
    const dataLine = lines.find((l) => l.startsWith('simple_metric '));
    expect(dataLine).toBeDefined();
    expect(dataLine).toMatch(/^simple_metric \d+(\.\d+)?$/);
  });

  it('outputs valid Prometheus text format (with labels)', async () => {
    const { incMetric, getPrometheusMetrics } = await freshMetrics();
    await incMetric('with_labels', { status: '200' });
    const output = await getPrometheusMetrics();
    expect(output).toContain('with_labels{status="200"} 1');
  });
});
