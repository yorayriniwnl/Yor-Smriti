/**
 * Metrics registry — Prometheus-style counters and gauges.
 *
 * Bug 45 fix: the original implementation stored all data in a module-scope
 * `Map`. On Vercel each serverless invocation can be a fresh cold start, so
 * the Map was wiped on every new function instance, making the admin dashboard
 * show wildly inconsistent numbers or all-zeros.
 *
 * Fix: persist every write to Upstash Redis (the same KV layer used by
 * db.ts).  In-memory state is kept as a write-through cache so reads within
 * the same hot instance are fast.  On a cold start the in-memory Map is empty
 * but Redis is the source of truth — getPrometheusMetrics() re-hydrates from
 * Redis before serialising.
 *
 * Graceful degradation: if Upstash is not configured (local dev / missing env
 * vars) all writes succeed in-memory only, identical to the original
 * behaviour — no crash, just no cross-invocation persistence.
 */

type Labels = Record<string, string>;

// ─── In-process write-through cache ─────────────────────────────────────────
const cache = new Map<string, Map<string, number>>();

// ─── Upstash REST helpers ────────────────────────────────────────────────────
import { getUpstashConfig, upstashCmd } from './upstash';
import type { UpstashConfig } from './upstash';

function getConfig(): UpstashConfig | null {
  return getUpstashConfig();
}

const kvCmd = (cfg: UpstashConfig, ...args: unknown[]): Promise<unknown> =>
  upstashCmd(cfg, ...args);

// Redis key:  metric:<name>:<serialised-label-set>
function redisKey(name: string, labelKey: string): string {
  return `metric:${name}:${labelKey || '__none__'}`;
}

function labelsKey(labels?: Labels): string {
  if (!labels || Object.keys(labels).length === 0) return '';
  return Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '\\"')}"`)
    .join(',');
}

// ─── Cache helpers ───────────────────────────────────────────────────────────
function cacheGet(name: string, key: string): number {
  return cache.get(name)?.get(key) ?? 0;
}
function cacheSet(name: string, key: string, value: number): void {
  let family = cache.get(name);
  if (!family) { family = new Map(); cache.set(name, family); }
  family.set(key, value);
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function incMetric(
  name: string,
  labels?: Labels,
  amount = 1,
): Promise<void> {
  const key = labelsKey(labels);
  cacheSet(name, key, cacheGet(name, key) + amount);

  const cfg = getConfig();
  if (!cfg) return; // local dev — in-memory only, that's fine

  try {
    await kvCmd(cfg, 'INCRBYFLOAT', redisKey(name, key), amount);
  } catch {
    // Never let a metrics write break a request
  }
}

export async function setGauge(
  name: string,
  labels: Labels | undefined,
  value: number,
): Promise<void> {
  const key = labelsKey(labels);
  cacheSet(name, key, value);

  const cfg = getConfig();
  if (!cfg) return;

  try {
    await kvCmd(cfg, 'SET', redisKey(name, key), value);
  } catch {
    // Silent — gauges are best-effort
  }
}

// ─── Scrape-result cache (Issue 9 fix) ──────────────────────────────────────
// A full Redis SCAN on every Prometheus scrape (default: every 15 s) burns
// O(N) Redis ops per interval — easily 28× the Upstash free-tier daily budget
// with 50+ metric keys. Fix: only re-hydrate from Redis when the in-process
// snapshot is stale. Hot scrapes within the TTL window read from the in-memory
// Map, which is already kept up-to-date by incMetric/setGauge (write-through).
const SCRAPE_CACHE_TTL_MS = 10_000; // 10 s — safely under the 15 s Prometheus default
let scrapeCacheAt = 0; // epoch ms of last successful Redis hydration (0 = cold)

/**
 * Returns a Prometheus text-format metrics snapshot.
 *
 * On a cold start the in-process cache is empty; this function SCANs all
 * metric:* keys from Redis and hydrates the cache before serialising, so the
 * admin dashboard always gets the real accumulated totals.
 *
 * The Redis SCAN is throttled to at most once per SCRAPE_CACHE_TTL_MS.
 * Subsequent calls within the same window return the in-process snapshot,
 * capping Upstash usage to ≤1 SCAN+GETs per 10 s regardless of scrape rate.
 */
export async function getPrometheusMetrics(): Promise<string> {
  const cfg = getConfig();
  const now = Date.now();

  // Only go to Redis when the snapshot is stale (cold start or TTL expired)
  if (cfg && now - scrapeCacheAt >= SCRAPE_CACHE_TTL_MS) {
    try {
      let cursor = '0';
      do {
        const result = (await kvCmd(
          cfg, 'SCAN', cursor, 'MATCH', 'metric:*', 'COUNT', 200,
        )) as [string, string[]];
        cursor = result[0];
        const keys: string[] = result[1] ?? [];

        await Promise.all(keys.map(async (rk) => {
          const raw = await kvCmd(cfg, 'GET', rk) as string | number | null;
          if (raw === null) return;
          // rk = "metric:<n>:<labelKey>" — name can't contain ":"
          const withoutPrefix = rk.slice('metric:'.length);
          const colonIdx = withoutPrefix.indexOf(':');
          const metricName = withoutPrefix.slice(0, colonIdx);
          const labelKey = withoutPrefix.slice(colonIdx + 1).replace(/^__none__$/, '');
          const value = typeof raw === 'number' ? raw : parseFloat(String(raw));
          if (!isNaN(value)) cacheSet(metricName, labelKey, value);
        }));
      } while (cursor !== '0');

      scrapeCacheAt = Date.now(); // mark snapshot as fresh
    } catch {
      // Fall through — serialise whatever is in the in-memory cache
    }
  }
  let out = '';
  for (const [name, family] of cache) {
    out += `# TYPE ${name} counter\n`;
    for (const [labelKey, val] of family) {
      const labels = labelKey ? `{${labelKey}}` : '';
      out += `${name}${labels} ${val}\n`;
    }
  }
  return out;
}
