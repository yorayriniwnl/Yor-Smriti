/**
 * Admin stats endpoint — aggregates in-memory Prometheus metrics + persistent db data.
 * Requires authentication.
 */
import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getReplyEntries } from '@/lib/db';
import { getRedisInfo } from '@/lib/rateLimiter';

function parseMetrics(raw: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const line of raw.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    const match = line.match(/^([a-z_]+)(?:\{[^}]*\})?\s+([\d.e+\-]+)/);
    if (match) {
      result[match[1]] = (result[match[1]] ?? 0) + parseFloat(match[2]);
    }
  }
  return result;
}

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  const [rawMetrics, redisInfo, replyEntries] = await Promise.all([
    Promise.resolve(getPrometheusMetrics()),
    getRedisInfo(),
    getReplyEntries(100).catch(()  => [] as Awaited<ReturnType<typeof getReplyEntries>>),
  ]);

  // Aggregate replies by mood
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

    // In-memory Prometheus counters (resets on cold start)
    memory: parseMetrics(rawMetrics),

    // Persistent data from Upstash (survives restarts)
    persistent: {
      replies: {
        total: replyEntries.length,
        byMood: repliesByMood,
        latest: replyEntries.slice(0, 3).map((r) => ({
          mood: r.mood,
          createdAt: r.createdAt,
          preview: r.message.slice(0, 60) + (r.message.length > 60 ? '…' : ''),
        })),
      },
    },

    // Infrastructure
    redis: redisInfo,

    // Config (non-sensitive keys only)
    config: {
      authSecret:          Boolean((process.env.AUTH_SECRET?.length ?? 0) >= 32),
      openai:              Boolean(process.env.OPENAI_API_KEY),
      email:               Boolean(process.env.RESEND_API_KEY),
      recipientConfigured: Boolean(process.env.RECIPIENT_NAME),
    },
  });
}
