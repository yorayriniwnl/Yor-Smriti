/**
 * Admin stats endpoint — aggregates in-memory Prometheus metrics + persistent db data.
 * Requires authentication AND the configured admin username.
 */
import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getReplyEntries } from '@/lib/db';
import { getRedisInfo } from '@/lib/rateLimiter';
import { parseMetrics } from '@/lib/parseMetrics';

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  const session = token ? verifySession(token) : null;

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  // Role guard — only the real admin user, not guest sessions
  if (session.sub === 'guest') {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }
  const configuredUsername = process.env.APP_USERNAME ?? '';
  if (configuredUsername && session.sub !== configuredUsername) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  const [rawMetrics, redisInfo, replyEntries] = await Promise.all([
    getPrometheusMetrics(),
    getRedisInfo(),
    getReplyEntries(100).catch(() => [] as Awaited<ReturnType<typeof getReplyEntries>>),
  ]);

  const repliesByMood = replyEntries.reduce(
    (acc, e) => {
      const m = e.mood as keyof typeof acc;
      if (m in acc) acc[m]++;
      return acc;
    },
    { yes: 0, maybe: 0, needTime: 0, no: 0 }
  );

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSec: Math.floor(process.uptime()),
    memory: parseMetrics(rawMetrics),
    persistent: {
      replies: {
        total: replyEntries.length,
        byMood: repliesByMood,
        latest: replyEntries.slice(0, 3).map((r) => ({
          mood: r.mood,
          createdAt: r.createdAt,
          preview: r.message.slice(0, 60) + (r.message.length > 60 ? '…' : ''),
          // IP intentionally omitted
        })),
      },
    },
    redis: redisInfo,
    config: {
      authSecret:          Boolean((process.env.AUTH_SECRET?.length ?? 0) >= 32),
      openai:              Boolean(process.env.OPENAI_API_KEY),
      email:               Boolean(process.env.RESEND_API_KEY),
      recipientConfigured: Boolean(process.env.RECIPIENT_NAME),
    },
  });
}
