export type RateLimitEntry = { count: number; first: number };

const store = new Map<string, RateLimitEntry>();

export function checkAndRecordRateLimit(key: string, limit = 5, windowMs = 60_000) {
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

export function resetRateLimitKey(key: string) {
  store.delete(key);
}
