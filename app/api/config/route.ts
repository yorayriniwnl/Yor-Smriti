import { NextResponse } from 'next/server';
import { getClientPersonalizationConfig } from '@/lib/serverEnv';
import { getTokenFromRequest, verifySession } from '@/lib/auth';

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  // Only the 4 fields the client UI renders. AI system-prompt fields
  // (breakupReason, memory1-5, whatSheMeansToMe, etc.) stay server-only.
  const config = getClientPersonalizationConfig();

  return NextResponse.json({
    ok: true,
    personalization: config,
  }, {
    // no-store: sensitive content must not sit in the browser's HTTP cache
    // (DevTools → Network → Cache) after the session ends.
    headers: { 'Cache-Control': 'no-store, private' },
  });
}
