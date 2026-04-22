import { logger } from './logger';
import type { Redis as RedisClient } from 'ioredis';

export type RateLimitEntry = { count: number; first: number };

// ─── Upstash Redis (serverless-compatible, recommended for Vercel) ──────────
// Uses HTTP API — works in both Edge and Node.js runtimes.

const __upstashClient: { url: string; token: string } | null = null;

function getUpstashConfig(): { url: string; token: string } | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  return null;
}

async function upstashCommand(config: { url: string; token: string }, ...args: unknown[]): Promise<unknown> {
  const res = await fetch(`${config.url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
  const data = await res.json() as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ─── Standard ioredis (self-hosted Redis, long-running processes) ──────────

declare global {
  var __yor_redis_client: RedisClient | null | undefined;
}

const store = new Map<string, RateLimitEntry>();

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

      // Atomic INCR + EXPIRE
      const count = await upstashCommand(upstash, 'INCR', redisKey) as number;
      if (count === 1) {
        await upstashCommand(upstash, 'EXPIRE', redisKey, windowSec);
      }
      const ttl = await upstashCommand(upstash, 'TTL', redisKey) as number;
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
      const pong = await upstashCommand(upstash, 'PING') as string;
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
