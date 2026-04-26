import { logger } from './logger';
import type { Redis as RedisClient } from 'ioredis';
import { getUpstashConfig, upstashCmd, upstashPipeline } from './upstash';

export type RateLimitEntry = { count: number; first: number };

// ─── Standard ioredis (self-hosted Redis, long-running processes) ──────────

declare global {
  var __yor_redis_client: RedisClient | null | undefined;
}

const store = new Map<string, RateLimitEntry>();

/** Remove entries whose window has expired to prevent unbounded memory growth. */
function evictExpired(windowMs: number): void {
  const now = Date.now();
  for (const [k, v] of store) {
    if (now - v.first >= windowMs) store.delete(k);
  }
}

let __redisClient: RedisClient | null = globalThis.__yor_redis_client ?? null;

async function getIoredisClient(): Promise<RedisClient | null> {
  if (__redisClient) return __redisClient;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const { default: Redis } = await import('ioredis');
    __redisClient = new Redis(url);
    try {
      __redisClient.on('connect', () => logger.info('[rateLimiter] Redis connected'));
      __redisClient.on('error', (err: Error) => logger.error('[rateLimiter] Redis error', err?.message ?? String(err)));
    } catch { /* ignore */ }
    globalThis.__yor_redis_client = __redisClient;
    return __redisClient;
  } catch {
    return null;
  }
}

// ─── Rate limit check ────────────────────────────────────────────────────────

export async function checkAndRecordRateLimit(key: string, limit = 5, windowMs = 60_000) {
  // 1. Try Upstash (serverless)
  const upstash = getUpstashConfig();
  if (upstash) {
    try {
      const redisKey = `rl:${key}`;
      const now = Date.now();
      const windowSec = Math.ceil(windowMs / 1000);

      // Use a pipeline (array of commands in one HTTP request) so INCR and
      // EXPIRE are sent atomically — eliminates the race condition where a
      // process crash between the two calls leaves a key that never expires.
      const pipeline = await upstashPipeline(upstash, [
        ['INCR', redisKey],
        ['EXPIRE', redisKey, windowSec, 'NX'],  // NX: only set TTL on first write
        ['TTL', redisKey],
      ]);

      const count  = Number(pipeline[0]?.result ?? 0);
      const ttl    = Number(pipeline[2]?.result ?? windowSec);
      const resetMs = now + (ttl > 0 ? ttl * 1000 : windowMs);

      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetMs,
      };
    } catch (err) {
      logger.warn('[rateLimiter] Upstash error, falling back:', String(err));
    }
  }

  // 2. Try ioredis (standard Redis)
  const client = await getIoredisClient();
  if (client) {
    try {
      const redisKey = `rl:${key}`;
      const script = `local c = redis.call('INCR', KEYS[1])\nif tonumber(c) == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end\nreturn c`;
      const res = await client.eval(script, 1, redisKey, String(windowMs));
      const count = Number(res ?? 0);
      const ttl = await client.pttl(redisKey);
      const resetMs = Date.now() + (ttl > 0 ? ttl : windowMs);
      return { allowed: count <= limit, remaining: Math.max(0, limit - count), resetMs };
    } catch { /* fall through to in-memory */ }
  }

  // 3. In-memory fallback (single instance, resets on restart)
  evictExpired(windowMs); // keep map bounded — remove stale entries before reading
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.first >= windowMs) {
    store.set(key, { count: 1, first: now });
    return { allowed: true, remaining: limit - 1, resetMs: now + windowMs };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetMs: entry.first + windowMs };
  }
  store.set(key, entry);
  return { allowed: true, remaining: Math.max(0, limit - entry.count), resetMs: entry.first + windowMs };
}

export async function getRedisInfo(): Promise<{ available: boolean; pong?: string; type?: string }> {
  const upstash = getUpstashConfig();
  if (upstash) {
    try {
      const pong = await upstashCmd(upstash, 'PING') as string;
      return { available: true, pong, type: 'upstash' };
    } catch {
      return { available: false, type: 'upstash' };
    }
  }

  const client = await getIoredisClient();
  if (!client) return { available: false };
  try {
    const pong = await client.ping();
    return { available: true, pong, type: 'ioredis' };
  } catch {
    return { available: false };
  }
}
