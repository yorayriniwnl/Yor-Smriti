import { NextResponse } from 'next/server';
import { getRedisInfo } from '@/lib/rateLimiter';
import { logger } from '@/lib/logger';

interface HealthResponse {
  ok: boolean;
  uptimeSec: number;
  version: string;
  config: {
    authSecret: boolean;
    openai: boolean;
    appCredentials: boolean;
    recipientConfigured: boolean;
    email: boolean;
    redis: boolean;
  };
  redis?: { available: boolean; pong?: string; type?: string };
}

export async function GET(): Promise<NextResponse> {
  const uptimeSec = Math.floor(process.uptime());

  const out: HealthResponse = {
    ok: true,
    uptimeSec,
    version: process.env.npm_package_version ?? '1.0.0',
    config: {
      authSecret:          Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32),
      openai:              Boolean(process.env.OPENAI_API_KEY),
      appCredentials:      Boolean(process.env.APP_USERNAME && process.env.APP_PASSWORD),
      recipientConfigured: Boolean(process.env.RECIPIENT_NAME),
      email:               Boolean(process.env.RESEND_API_KEY),
      redis:               Boolean(process.env.REDIS_URL || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)),
    },
  };

  if (!out.config.authSecret && process.env.NODE_ENV === 'production') {
    out.ok = false;
    logger.warn('Health check: AUTH_SECRET not configured or too short');
  }

  try {
    out.redis = await getRedisInfo();
  } catch (err) {
    logger.error('Health check error:', err);
    out.redis = { available: false };
  }

  return NextResponse.json(out, { status: out.ok ? 200 : 500 });
}
