import { NextResponse } from 'next/server';
import { getPersonalizationConfig } from '@/lib/serverEnv';
import { getTokenFromRequest, verifySession } from '@/lib/auth';

export async function GET(request: Request): Promise<NextResponse> {
  // Require session
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  const config = getPersonalizationConfig();

  return NextResponse.json({
    ok: true,
    personalization: config,
  }, {
    headers: {
      // Cache on client for 1 hour — personalization rarely changes
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
