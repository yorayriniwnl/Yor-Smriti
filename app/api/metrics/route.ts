import { NextResponse } from 'next/server';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { parseMetrics } from '@/lib/parseMetrics';
import { secureCompare } from '@/lib/security';

export async function GET(request: Request): Promise<NextResponse> {
  const accept = request.headers.get('accept') ?? '';
  const wantsJson = accept.includes('application/json');

  // All formats require either a valid session OR a scrape secret.
  // Set METRICS_SCRAPE_SECRET in env and pass it as:
  //   Authorization: Bearer <METRICS_SCRAPE_SECRET>
  // This allows Prometheus scrapers to work without a full session cookie.
  const scrapeSecret = process.env.METRICS_SCRAPE_SECRET;
  const authHeader   = request.headers.get('authorization') ?? '';
  const bearerToken  = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const hasScrapeSecret = Boolean(scrapeSecret && bearerToken && secureCompare(bearerToken, scrapeSecret));
  const hasSession = (() => {
    const token = getTokenFromRequest(request);
    return token ? Boolean(verifySession(token)) : false;
  })();

  if (!hasScrapeSecret && !hasSession) {
    if (wantsJson) {
      return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
    }
    // Prometheus scrapers expect a plain-text 401
    return new NextResponse('Unauthorized\n', {
      status: 401,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const body = await getPrometheusMetrics();

  if (wantsJson) {
    return NextResponse.json({ ok: true, metrics: parseMetrics(body) });
  }

  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' },
  });
}
