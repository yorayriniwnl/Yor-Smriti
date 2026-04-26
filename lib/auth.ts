import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = 'yor_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

// ─── Random dev secret (generated once per process) ──────────────────────────
// Only used when AUTH_SECRET is unset in non-production environments.
const _devSecret: string = (() => {
  const secret = crypto.randomBytes(48).toString('hex');
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[auth] WARNING: AUTH_SECRET is not set. A random secret has been generated for this ' +
      'process. Sessions will be invalidated on every restart. Set AUTH_SECRET in .env.local ' +
      'to persist sessions across restarts.'
    );
  }
  return secret;
})();

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to a random string ≥32 chars in production.');
    }
    return _devSecret;
  }
  return s;
}

// ─── JWT (HS256) ──────────────────────────────────────────────────────────────

export interface SessionPayload {
  sub: string;   // username
  iat: number;   // issued-at (unix sec)
  exp: number;   // expiry (unix sec)
}

function signPayload(payload: Record<string, unknown>): string {
  const secret = getSecret();
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${header}.${body}`;
  const sig = crypto.createHmac('sha256', secret).update(unsigned).digest().toString('base64url');
  return `${unsigned}.${sig}`;
}

function verifyPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const secret = getSecret();
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest()
      .toString('base64url');

    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expectedSig, 'base64url');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const parsedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8')) as {
      alg?: unknown;
      typ?: unknown;
    };
    if (parsedHeader.alg !== 'HS256' || parsedHeader.typ !== 'JWT') return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export function signSession(username: string): string {
  const now     = Math.floor(Date.now() / 1000);
  return signPayload({
    sub: username,
    iat: now,
    exp: now + SESSION_MAX_AGE_SEC,
  });
}

export function verifySession(token: string): SessionPayload | null {
  const data = verifyPayload(token);
  if (!data) return null;

  if (
    typeof data.sub !== 'string' ||
    typeof data.iat !== 'number' ||
    typeof data.exp !== 'number'
  ) {
    return null;
  }

  return {
    sub: data.sub,
    iat: data.iat,
    exp: data.exp,
  };
}

export function signScopedToken(scope: string, maxAgeSec: number): string {
  const now = Math.floor(Date.now() / 1000);
  return signPayload({
    scope,
    iat: now,
    exp: now + maxAgeSec,
  });
}

export function verifyScopedToken(token: string, expectedScope: string): boolean {
  const data = verifyPayload(token);
  if (!data) return false;

  if (
    typeof data.scope !== 'string' ||
    typeof data.iat !== 'number' ||
    typeof data.exp !== 'number'
  ) {
    return false;
  }

  return data.scope === expectedScope;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return (
    `${SESSION_COOKIE}=${encodeURIComponent(token)}` +
    `; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SEC}${secure}`
  );
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function getTokenFromRequest(request: Request): string | null {
  const raw = request.headers.get('cookie') ?? '';
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── requireSession — throws a plain Error if unauthenticated ──────────────
/**
 * Verifies the session cookie on `request`.
 * Returns the validated SessionPayload on success.
 * Throws a plain `Error` (with a human-readable message) if no valid session
 * is found — callers should let it propagate to the Next.js error boundary or
 * catch it and return an appropriate Response themselves.
 */
export function requireSession(request: Request): SessionPayload {
  const token = getTokenFromRequest(request);
  if (!token) throw new Error('Authentication required.');
  const payload = verifySession(token);
  if (!payload) throw new Error('Session expired. Please log in again.');
  return payload;
}

export function unauthorizedResponse(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}
