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
import { getUpstashConfig, upstashCmd, upstashPipeline } from './upstash';
import type { UpstashConfig } from './upstash';

function getConfig(): UpstashConfig | null {
  return getUpstashConfig();
}

const kv = (config: UpstashConfig, ...args: unknown[]): Promise<unknown> =>
  upstashCmd(config, ...args);

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

    // Issue 13 fix: batch all GETs in a single HTTP round-trip via pipeline
    // instead of firing N individual upstashCmd calls (N+1 pattern).
    const pipeline = ids.map((id) => ['GET', `reply:${id}`]);
    const results = await upstashPipeline(cfg, pipeline);
    const entries = results.map((r) =>
      typeof r.result === 'string' ? (JSON.parse(r.result) as ReplyEntry) : null
    );

    return entries.filter((entry): entry is ReplyEntry => entry !== null);
  } catch (err) {
    logger.error('[db] Failed to fetch replies:', String(err));
    return [];
  }
}
