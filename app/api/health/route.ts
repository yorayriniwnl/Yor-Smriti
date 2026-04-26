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
    // appCredentials is intentionally omitted from the public type —
    // it is only included in authenticated responses (see below).
    recipientConfigured: boolean;
    email: boolean;
    redis: boolean;
  };
  redis?: { available: boolean; pong?: string; type?: string };
}

/**
 * Issue 14 fix: gate the sensitive `appCredentials` field behind a bearer
 * token check using AUTH_SECRET.  An unauthenticated Prometheus scraper or
 * curl probe must not be able to learn whether credentials are set — that
 * is free recon that directly signals "this deployment is open to the world".
 *
 * Authenticated callers (Authorization: Bearer <AUTH_SECRET>) receive the
 * full config object.  All other callers receive the same shape minus
 * `appCredentials`.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get('Authorization') ?? '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] === secret : false;
}

export async function GET(request: Request): Promise<NextResponse> {
  const uptimeSec = Math.floor(process.uptime());
  const authorized = isAuthorized(request);

  const out: HealthResponse = {
    ok: true,
    uptimeSec,
    version: process.env.npm_package_version ?? '1.0.0',
    config: {
      authSecret:          Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32),
      openai:              Boolean(process.env.OPENAI_API_KEY),
      recipientConfigured: Boolean(process.env.RECIPIENT_NAME),
      email:               Boolean(process.env.RESEND_API_KEY),
      redis:               Boolean(process.env.REDIS_URL || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)),
    },
  };

  // Only expose credential status to authenticated callers
  if (authorized) {
    (out.config as Record<string, unknown>).appCredentials =
      Boolean(process.env.APP_USERNAME && process.env.APP_PASSWORD);
  }

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
