import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';

export async function GET(request: Request): Promise<NextResponse> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }
  const payload = verifySession(token);
  if (!payload) {
    return NextResponse.json({ ok: false, authenticated: false, reason: 'expired' }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: payload.sub,
    exp: payload.exp,
  });
}
