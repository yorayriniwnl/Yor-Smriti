import { NextResponse } from 'next/server';
import { clearSessionCookieHeader } from '@/lib/auth';
import { incMetric } from '@/lib/metrics';
import { verifyCsrfHeader } from '@/lib/request';

export async function POST(request: Request): Promise<NextResponse> {
  if (!verifyCsrfHeader(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  incMetric('logout_total');
  return NextResponse.json(
    { ok: true },
    { headers: { 'Set-Cookie': clearSessionCookieHeader() } }
  );
}
