import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

// ─── Constants ────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = 'yor_session';
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET must be set to a random string ≥32 chars in production.');
    }
    // Dev fallback — deterministic, never used in prod
    return 'dev-secret-yor-smriti-change-in-production-32';
  }
  return s;
}

// ─── JWT (HS256) ──────────────────────────────────────────────────────────────

export interface SessionPayload {
  sub: string;   // username
  iat: number;   // issued-at (unix sec)
  exp: number;   // expiry (unix sec)
}

export function signSession(username: string): string {
  const secret = getSecret();
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now     = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    iat: now,
    exp: now + SESSION_MAX_AGE_SEC,
  })).toString('base64url');
  const unsigned = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', secret).update(unsigned).digest().toString('base64url');
  return `${unsigned}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
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

    // Timing-safe compare
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expectedSig, 'base64url');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
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

// ─── requireSession — throws 401 JSON response if unauthenticated ──────────

export function requireSession(request: Request): SessionPayload {
  const token = getTokenFromRequest(request);
  if (!token) throw unauthorizedResponse('Authentication required.');
  const payload = verifySession(token);
  if (!payload) throw unauthorizedResponse('Session expired. Please log in again.');
  return payload;
}

export function unauthorizedResponse(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 401 });
}
