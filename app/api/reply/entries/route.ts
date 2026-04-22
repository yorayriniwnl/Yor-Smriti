import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { getReplyEntries, type ReplyEntry } from '@/lib/db';

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  const url   = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 100);

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

    return NextResponse.json({ ok: true, total: entries.length, byMood, entries });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch replies.', detail: String(err) },
      { status: 500 }
    );
  }
}
