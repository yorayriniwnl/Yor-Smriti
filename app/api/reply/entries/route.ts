import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getReplyEntries, type ReplyEntry } from '@/lib/db';

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  const session = token ? verifySession(token) : null;
  if (!session) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }
  if (session.sub === 'guest') {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  const configuredUsername = process.env.APP_USERNAME ?? '';
  if (configuredUsername && session.sub !== configuredUsername) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get('limit') ?? '50');
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 100)
    : 50;

  try {
    const entries: ReplyEntry[] = await getReplyEntries(limit);

    const byMood = entries.reduce(
      (acc, e) => {
        const m = e.mood as keyof typeof acc;
        if (m in acc) acc[m]++;
        return acc;
      },
      { yes: 0, maybe: 0, needTime: 0, no: 0 }
    );

    // Strip IP addresses before sending to client — admin UI doesn't need them
    // and exposing them creates unnecessary privacy/legal risk.
    const safeEntries = entries.map(({ mood, message, createdAt }) => ({
      mood,
      message,
      createdAt,
    }));

    return NextResponse.json({ ok: true, total: safeEntries.length, byMood, entries: safeEntries });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch replies.', detail: String(err) },
      { status: 500 }
    );
  }
}
