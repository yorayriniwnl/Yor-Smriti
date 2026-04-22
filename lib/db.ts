/**
 * Lightweight persistence layer using Upstash Redis as a key-value store.
 *
 * This gives us durable storage for replies without needing a full database.
 * All data survives server restarts.
 *
 * If Upstash is not configured, writes are no-ops and reads return empty
 * arrays - the app degrades gracefully (data is still logged + emailed).
 *
 * Setup: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in env.
 * Free tier: 10,000 requests/day, 256MB storage.
 */

import { logger } from './logger';

interface UpstashConfig {
  url: string;
  token: string;
}

function getConfig(): UpstashConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function kv(config: UpstashConfig, ...args: unknown[]): Promise<unknown> {
  const res = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash KV HTTP ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

export interface ReplyEntry {
  id: string;
  mood: string;
  message: string;
  createdAt: string;
  ip: string;
}

export async function saveReplyEntry(
  entry: Omit<ReplyEntry, 'id' | 'createdAt'>
): Promise<ReplyEntry | null> {
  const cfg = getConfig();
  if (!cfg) {
    logger.warn('[db] Upstash not configured - reply not persisted');
    return null;
  }

  const id = `reply_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full: ReplyEntry = {
    ...entry,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await kv(cfg, 'SET', `reply:${id}`, JSON.stringify(full));
    await kv(cfg, 'ZADD', 'reply:index', Date.now(), id);
    logger.info(`[db] Reply saved: ${id}`);
    return full;
  } catch (err) {
    logger.error('[db] Failed to save reply:', String(err));
    return null;
  }
}

export async function getReplyEntries(limit = 50): Promise<ReplyEntry[]> {
  const cfg = getConfig();
  if (!cfg) return [];

  try {
    const ids = (await kv(cfg, 'ZREVRANGE', 'reply:index', 0, limit - 1)) as string[];
    if (!ids || ids.length === 0) return [];

    const entries = await Promise.all(
      ids.map(async (id) => {
        const raw = (await kv(cfg, 'GET', `reply:${id}`)) as string | null;
        return raw ? (JSON.parse(raw) as ReplyEntry) : null;
      })
    );

    return entries.filter((entry): entry is ReplyEntry => entry !== null);
  } catch (err) {
    logger.error('[db] Failed to fetch replies:', String(err));
    return [];
  }
}
