import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { sanitizeString } from '@/lib/sanitize';
import { incMetric } from '@/lib/metrics';
import { logger } from '@/lib/logger';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { getClientIp, verifyCsrfHeader } from '@/lib/request';
import { notifyReplyReceived } from '@/lib/email';
import { saveReplyEntry } from '@/lib/db';

interface ReplyBody {
  message: string;
  mood?: 'yes' | 'maybe' | 'needTime' | 'no';
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!verifyCsrfHeader(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const rl = await checkAndRecordRateLimit(`reply:${ip}`, 3, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Please wait before sending another reply.' },
      { status: 429 }
    );
  }

  let body: ReplyBody;
  try {
    body = (await request.json()) as ReplyBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid body.' }, { status: 400 });
  }

  const message = sanitizeString(body.message ?? '', { maxLength: 2000, allowNewlines: true });
  if (!message) {
    return NextResponse.json({ ok: false, error: 'Message is required.' }, { status: 400 });
  }

  const VALID_MOODS = new Set(['yes', 'maybe', 'needTime', 'no']);
  const mood = VALID_MOODS.has(body.mood ?? '') ? (body.mood ?? 'maybe') : 'maybe';

  logger.info(`[reply] mood=${mood} length=${message.length} ip=${ip}`);
  incMetric('reply_received_total', { mood });

  // Persist via db.ts (Upstash sorted set — survives restarts)
  saveReplyEntry({ mood, message, ip }).catch((e: unknown) =>
    logger.error('[reply] db save error:', e)
  );

  // Notification email — fire-and-forget
  notifyReplyReceived({ mood, message, ip }).catch((e: unknown) =>
    logger.error('[reply] email error:', e)
  );

  return NextResponse.json({ ok: true, received: true });
}

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    note: 'View entries at GET /api/admin/stats or GET /api/reply/entries',
  });
}
