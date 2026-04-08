export type RateLimitEntry = { count: number; first: number };

const store = new Map<string, RateLimitEntry>();

let __redisClient: any | null = (globalThis as any).__yor_redis_client ?? null;

async function getRedisClient() {
  if (__redisClient) return __redisClient;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  try {
    const { default: Redis } = await import('ioredis');
    __redisClient = new Redis(url);
    // attach lightweight logging/monitoring hooks
    try {
      __redisClient.on('connect', () => {
        console.info('[rateLimiter] Redis connected');
      });
      __redisClient.on('ready', () => {
        console.info('[rateLimiter] Redis ready');
      });
      __redisClient.on('error', (err: any) => {
        console.error('[rateLimiter] Redis error', err?.message ?? err);
      });
      __redisClient.on('close', () => {
        console.warn('[rateLimiter] Redis connection closed');
      });
      __redisClient.on('reconnecting', () => {
        console.warn('[rateLimiter] Redis reconnecting');
      });
    } catch (e) {
      // ignore listener attach errors
    }
    (globalThis as any).__yor_redis_client = __redisClient;
    return __redisClient;
  } catch (e) {
    // If ioredis isn't available or fails to load, fall back to memory
    return null;
  }
}

export async function checkAndRecordRateLimit(key: string, limit = 5, windowMs = 60_000) {
  // Prefer Redis-backed counter if configured, otherwise fall back to in-memory Map.
  const client = await getRedisClient();
  if (client) {
    try {
      const redisKey = `rl:${key}`;
      const script = `local current = redis.call('INCR', KEYS[1])\nif tonumber(current) == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end\nreturn current`;
      const res = await client.eval(script, 1, redisKey, String(windowMs));
      const count = Number(res ?? 0);
      const ttl = await client.pttl(redisKey);
      const resetMs = Date.now() + (ttl > 0 ? ttl : windowMs);
      const allowed = count <= limit;
      return { allowed, remaining: Math.max(0, limit - count), resetMs };
    } catch (err) {
      // On any Redis error, silently fall back to in-memory behavior.
    }
  }

  // In-memory fallback
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now - entry.first >= windowMs) {
    store.set(key, { count: 1, first: now });
    return { allowed: true, remaining: limit - 1, resetMs: now + windowMs };
  }

  entry.count += 1;
  if (entry.count > limit) {
    const resetMs = entry.first + windowMs;
    return { allowed: false, remaining: 0, resetMs };
  }

  store.set(key, entry);
  return { allowed: true, remaining: Math.max(0, limit - entry.count), resetMs: entry.first + windowMs };
}

export async function resetRateLimitKey(key: string) {
  const client = await getRedisClient();
  if (client) {
    try {
      await client.del(`rl:${key}`);
      return;
    } catch (e) {
      // ignore and fall back
    }
  }
  store.delete(key);
}
