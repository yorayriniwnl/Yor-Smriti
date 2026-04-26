/**
 * Server-side password verification for /for-her-alone.
 *
 * On success, sets an HttpOnly `her_unlocked` cookie scoped to
 * /for-her-alone/content. The content route is a server component, so
 * the private letter never appears in any JavaScript bundle.
 *
 * Set HER_UNLOCK_PASSWORD in your environment variables.
 * Rate-limited: 10 attempts per 15 minutes per IP.
 */
import { NextResponse } from 'next/server';
import { verifyCsrfHeader, getClientIp } from '@/lib/request';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { secureCompare } from '@/lib/security';
import { logger } from '@/lib/logger';

const UNLOCK_COOKIE_MAX_AGE_SECS = 2 * 60 * 60; // 2 hours

export async function POST(request: Request): Promise<NextResponse> {
  if (!verifyCsrfHeader(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rl = await checkAndRecordRateLimit(`her-unlock:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid body.' }, { status: 400 });
  }

  const submitted = (body.password ?? '').trim();
  const expected  = (process.env.HER_UNLOCK_PASSWORD ?? '').trim();

  if (!expected) {
    logger.warn('[her-unlock] HER_UNLOCK_PASSWORD is not set — blocking all attempts');
    return NextResponse.json({ ok: false, error: 'Not configured.' }, { status: 503 });
  }

  const match = secureCompare(submitted, expected);

  if (!match) {
    logger.info(`[her-unlock] Failed attempt from ip=${ip}`);
    return NextResponse.json({ ok: false, error: 'Incorrect.' }, { status: 401 });
  }

  logger.info(`[her-unlock] Successful unlock from ip=${ip}`);

  // Set HttpOnly cookie scoped to the content route only.
  // JS cannot read this cookie — it is purely a server-side gate token.
  const res = NextResponse.json({ ok: true });
  res.cookies.set('her_unlocked', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/for-her-alone/content',
    maxAge: UNLOCK_COOKIE_MAX_AGE_SECS,
  });
  return res;
}
