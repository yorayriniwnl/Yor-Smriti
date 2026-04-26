import { NextResponse } from 'next/server';
import { sanitizeString } from '@/lib/sanitize';
import { secureCompare } from '@/lib/security';
import { getOptionalServerEnv } from '@/lib/serverEnv';
import { incMetric } from '@/lib/metrics';
import { logger } from '@/lib/logger';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';
import { signSession, sessionCookieHeader } from '@/lib/auth';
import { getClientIp, verifyCsrfHeader } from '@/lib/request';

interface LoginRequestBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const configuredUsername = getOptionalServerEnv('APP_USERNAME') ?? '';
    const configuredPassword = getOptionalServerEnv('APP_PASSWORD') ?? '';

    // If no credentials are configured, auto-login as guest (open experience)
    const openAccess = !configuredUsername && !configuredPassword;

    // Issue 14 fix: loud warning so misconfigured production deployments are
    // immediately visible in logs rather than silently open to the world.
    if (openAccess && process.env.NODE_ENV === 'production') {
      logger.warn(
        '[login] OPEN-ACCESS MODE ACTIVE — APP_USERNAME and APP_PASSWORD are not set. ' +
        'Every request will receive a valid session without any credentials. ' +
        'Set both variables in your environment to enable authentication.'
      );
    }

    let body: LoginRequestBody;
    try {
      body = (await request.json()) as LoginRequestBody;
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const rawUser = typeof body.username === 'string' ? body.username : '';
    const rawPass = typeof body.password === 'string' ? body.password : '';
    const requestedUsername = sanitizeString(rawUser, { maxLength: 128, allowNewlines: false });
    // The login UI is password-first and does not expose a username field.
    // When the client omits username, fall back to the configured one.
    const username = requestedUsername || configuredUsername || 'guest';
    const password = sanitizeString(rawPass, { maxLength: 256, allowNewlines: false });

    // Rate-limit per IP + username
    // CSRF check
    if (!verifyCsrfHeader(request)) {
      return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
    }

    const ip = getClientIp(request);
    const rateKey = `login:${ip}:${username}`;
    const limit = Number(getOptionalServerEnv('LOGIN_RATE_LIMIT') ?? '10');
    const windowMs = Number(getOptionalServerEnv('LOGIN_RATE_WINDOW_MS') ?? '60000');

    const rl = await checkAndRecordRateLimit(rateKey, limit, windowMs);
    if (!rl.allowed) {
      incMetric('rate_limit_blocked_total', { endpoint: 'login' });
      const retryAfter = Math.max(0, Math.ceil((rl.resetMs - Date.now()) / 1000));
      return NextResponse.json(
        { ok: false, error: 'Too many login attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }
    incMetric('rate_limit_allowed_total', { endpoint: 'login' });

    // Verify credentials (skip if open access)
    if (!openAccess) {
      if (!configuredUsername || !configuredPassword) {
        logger.error('Login API misconfigured: APP_USERNAME and APP_PASSWORD must both be set.');
        return NextResponse.json({ ok: false, error: 'Server misconfiguration.' }, { status: 500 });
      }
      const valid =
        secureCompare(username, configuredUsername) &&
        secureCompare(password, configuredPassword);
      if (!valid) {
        incMetric('login_failed_total');
        return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
      }
    }

    // Issue JWT session
    const sub = openAccess ? 'guest' : username;
    const token = signSession(sub);

    incMetric('login_success_total');
    logger.info(`Login success: ${sub} from ${ip}`);

    return NextResponse.json(
      { ok: true, user: sub },
      {
        status: 200,
        headers: { 'Set-Cookie': sessionCookieHeader(token) },
      }
    );
  } catch (err) {
    logger.error('Login API error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error.' }, { status: 500 });
  }
}
