/**
 * Shared Upstash Redis REST client.
 *
 * Previously lib/db.ts, lib/kv.ts, lib/rateLimiter.ts, and lib/metrics.ts
 * each contained their own copy of the same fetch-based HTTP wrapper.
 * Any change (timeout, error format, retry logic) had to be made in four
 * places. This module is the single source of truth.
 *
 * Usage:
 *   import { getUpstashConfig, upstashCmd, upstashPipeline } from '@/lib/upstash';
 *
 *   const cfg = getUpstashConfig();
 *   if (cfg) await upstashCmd(cfg, 'SET', 'key', 'value');
 */

export interface UpstashConfig {
  url: string;
  token: string;
}

/** Returns Upstash credentials from env, or null if not configured. */
export function getUpstashConfig(): UpstashConfig | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

/**
 * Execute a single Redis command via the Upstash REST API.
 *
 * @example
 *   await upstashCmd(cfg, 'SET', 'hello', 'world');
 *   const val = await upstashCmd(cfg, 'GET', 'hello');
 */
export async function upstashCmd(
  config: UpstashConfig,
  ...args: unknown[]
): Promise<unknown> {
  const res = await fetch(config.url, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify(args),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);

  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

/**
 * Execute multiple Redis commands in a single HTTP round-trip using
 * Upstash's /pipeline endpoint.
 *
 * Each element of `commands` is an array whose first element is the Redis
 * command name followed by its arguments — the same shape as upstashCmd's
 * variadic args.
 *
 * Returns an array of per-command results in the same order.
 *
 * @example
 *   const [incrResult, ttlResult] = await upstashPipeline(cfg, [
 *     ['INCR', 'rl:key'],
 *     ['EXPIRE', 'rl:key', 60, 'NX'],
 *     ['TTL', 'rl:key'],
 *   ]);
 */
export async function upstashPipeline(
  config: UpstashConfig,
  commands: unknown[][],
): Promise<Array<{ result?: unknown; error?: string }>> {
  const res = await fetch(`${config.url}/pipeline`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body:  JSON.stringify(commands),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Upstash pipeline HTTP ${res.status}`);

  return res.json() as Promise<Array<{ result?: unknown; error?: string }>>;
}
