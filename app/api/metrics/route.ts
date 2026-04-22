import { NextResponse } from 'next/server';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getTokenFromRequest, verifySession } from '@/lib/auth';

export async function GET(request: Request): Promise<NextResponse> {
  // Require session for JSON format; allow Prometheus scrape without session
  const accept = request.headers.get('accept') ?? '';
  const wantsJson = accept.includes('application/json');

  if (wantsJson) {
    const token = getTokenFromRequest(request);
    if (!token || !verifySession(token)) {
      return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
    }
  }

  const body = getPrometheusMetrics();

  if (wantsJson) {
    const result: Record<string, number> = {};
    for (const line of body.split('\n')) {
      if (line.startsWith('#') || !line.trim()) continue;
      const m = line.match(/^([a-z_]+)(?:\{[^}]*\})?\s+([\d.e+\-]+)/);
      if (m) {
        const key = m[1];
        result[key] = (result[key] ?? 0) + parseFloat(m[2]);
      }
    }
    return NextResponse.json({ ok: true, metrics: result });
  }

  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' },
  });
}
