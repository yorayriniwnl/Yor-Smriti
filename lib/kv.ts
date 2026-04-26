/**
 * Key-Value store backed by Upstash Redis REST API.
 * Falls back to in-memory Map when Upstash is not configured.
 * 
 * This module does NOT require the @upstash/redis npm package —
 * it uses the Upstash HTTP REST API directly with fetch().
 */

import { logger } from './logger';
import { getUpstashConfig, upstashCmd } from './upstash';
import type { UpstashConfig } from './upstash';

// In-memory fallback for dev / when Upstash is not configured
const memoryStore = new Map<string, string>();

const upstash = (config: UpstashConfig, ...cmd: unknown[]) =>
  upstashCmd(config, ...cmd);

// ─── Public API ───────────────────────────────────────────────────────────────

export async function kvSet(key: string, value: string, ttlSec?: number): Promise<void> {
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      if (ttlSec) {
        await upstash(cfg, 'SET', key, value, 'EX', ttlSec);
      } else {
        await upstash(cfg, 'SET', key, value);
      }
      return;
    } catch (err) {
      logger.warn('[kv] set failed, using memory:', String(err));
    }
  }
  memoryStore.set(key, value);
}

export async function kvGet(key: string): Promise<string | null> {
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      return (await upstash(cfg, 'GET', key)) as string | null;
    } catch (err) {
      logger.warn('[kv] get failed, using memory:', String(err));
    }
  }
  return memoryStore.get(key) ?? null;
}

export async function kvLPush(key: string, ...values: string[]): Promise<void> {
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      await upstash(cfg, 'LPUSH', key, ...values);
      return;
    } catch (err) {
      logger.warn('[kv] lpush failed, using memory:', String(err));
    }
  }
  // In-memory: store as JSON array under key
  const existing = memoryStore.get(key);
  const arr: string[] = existing ? JSON.parse(existing) : [];
  arr.unshift(...values);
  memoryStore.set(key, JSON.stringify(arr));
}

export async function kvLRange(key: string, start = 0, end = -1): Promise<string[]> {
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      return (await upstash(cfg, 'LRANGE', key, start, end)) as string[];
    } catch (err) {
      logger.warn('[kv] lrange failed, using memory:', String(err));
    }
  }
  const existing = memoryStore.get(key);
  if (!existing) return [];
  const arr: string[] = JSON.parse(existing);
  const e = end === -1 ? arr.length : end + 1;
  return arr.slice(start, e);
}

export async function kvIncr(key: string): Promise<number> {
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      return (await upstash(cfg, 'INCR', key)) as number;
    } catch (err) {
      logger.warn('[kv] incr failed, using memory:', String(err));
    }
  }
  const n = Number(memoryStore.get(key) ?? '0') + 1;
  memoryStore.set(key, String(n));
  return n;
}
