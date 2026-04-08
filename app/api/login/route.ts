import { NextResponse } from 'next/server';
import { sanitizeString } from '@/lib/sanitize';
import { secureCompare } from '@/lib/security';
import { getOptionalServerEnv } from '@/lib/serverEnv';
import { checkAndRecordRateLimit } from '@/lib/rateLimiter';

interface LoginRequestBody {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const configuredUsername = getOptionalServerEnv('APP_USERNAME') ?? '';
    const configuredPassword = getOptionalServerEnv('APP_PASSWORD') ?? '';

    if (!configuredUsername || !configuredPassword) {
      // Server is not configured to accept logins safely.
      console.error('Login API misconfigured: APP_USERNAME and APP_PASSWORD must be set.');
      return NextResponse.json({ ok: false, error: 'Server misconfiguration.' }, { status: 500 });
    }

    let body: LoginRequestBody;
    try {
      body = (await request.json()) as LoginRequestBody;
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
    }

    const rawUser = typeof body.username === 'string' ? body.username : '';
    const rawPass = typeof body.password === 'string' ? body.password : '';

    const username = sanitizeString(rawUser, { maxLength: 128, allowNewlines: false });
    const password = sanitizeString(rawPass, { maxLength: 256, allowNewlines: false });

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Missing username or password.' }, { status: 400 });
    }

    // Rate-limit login attempts per IP+username to mitigate brute-force attacks.
    const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor ?? realIp ?? 'unknown';
    const rateKey = `${ip}:${username}`;
    const limit = Number(getOptionalServerEnv('LOGIN_RATE_LIMIT') ?? '5');
    const windowMs = Number(getOptionalServerEnv('LOGIN_RATE_WINDOW_MS') ?? '60000');
    const rl = await checkAndRecordRateLimit(rateKey, limit, windowMs);
    if (!rl.allowed) {
      const retryAfter = Math.max(0, Math.ceil((rl.resetMs - Date.now()) / 1000));
      return NextResponse.json({ ok: false, error: 'Too many login attempts. Try again later.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
    }

    // Use constant-time compare to avoid timing attacks
    const isValid = secureCompare(username, configuredUsername) && secureCompare(password, configuredPassword);

    if (!isValid) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('Login API error:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error.' }, { status: 500 });
  }
}
