import { NextResponse } from 'next/server';
import { getRedisInfo } from '@/lib/rateLimiter';
import { logger } from '@/lib/logger';

export async function GET() {
  const uptimeSec = Math.floor(process.uptime());
  const out: any = { ok: true, uptimeSec };

  try {
    const redis = await getRedisInfo();
    out.redis = redis;
  } catch (err) {
    logger.error('Health check error:', err);
    out.redis = { available: false };
  }

  return NextResponse.json(out);
}
