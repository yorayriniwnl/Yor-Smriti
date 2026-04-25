/**
 * Server-side password verification for /for-her-alone.
 *
 * Set HER_UNLOCK_PASSWORD in your environment variables.
 * The password is NEVER shipped in the client bundle.
 *
 * Rate-limited to 10 attempts per 15 minutes per IP to prevent brute force.
 */
import { NextResponse } from 'next/server';
import { verifyCsrfHeader, getClientIp } from '@/lib/request';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { logger } from '@/lib/logger';

export async function POST(request: Request): Promise<NextResponse> {
  // CSRF guard
  if (!verifyCsrfHeader(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  // Rate limit: 10 attempts per 15 min per IP
  const ip = getClientIp(request);
  const rl = await checkAndRecordRateLimit(`her-unlock:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetMs - Date.now()) / 1000)) },
      }
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
    // No password configured — fail closed (don't accidentally expose the page)
    logger.warn('[her-unlock] HER_UNLOCK_PASSWORD is not set — blocking all attempts');
    return NextResponse.json({ ok: false, error: 'Not configured.' }, { status: 503 });
  }

  // Constant-time comparison to prevent timing attacks
  const enc = new TextEncoder();
  const a = enc.encode(submitted.padEnd(128));
  const b = enc.encode(expected.padEnd(128));
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  const match = diff === 0 && submitted.length === expected.length;

  if (!match) {
    logger.info(`[her-unlock] Failed attempt from ip=${ip}`);
    return NextResponse.json({ ok: false, error: 'Incorrect.' }, { status: 401 });
  }

  logger.info(`[her-unlock] Successful unlock from ip=${ip}`);
  return NextResponse.json({ ok: true });
}
