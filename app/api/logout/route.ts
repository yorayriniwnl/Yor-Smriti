import { NextResponse } from 'next/server';
import { clearSessionCookieHeader } from '@/lib/auth';
import { incMetric } from '@/lib/metrics';

export async function POST(): Promise<NextResponse> {
  incMetric('logout_total');
  return NextResponse.json(
    { ok: true },
    { headers: { 'Set-Cookie': clearSessionCookieHeader() } }
  );
}
