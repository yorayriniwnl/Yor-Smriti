/**
 * Unit tests for lib/auth.ts
 *
 * Covers the JWT sign/verify core, cookie helpers, and request parsing.
 * These are the highest-value paths — a regression here silently breaks
 * every protected route.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  signSession,
  verifySession,
  sessionCookieHeader,
  clearSessionCookieHeader,
  getTokenFromRequest,
  SESSION_COOKIE,
  signScopedToken,
  verifyScopedToken,
} from '../auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Decode a base64url segment without importing the full module. */
function b64uDecode(s: string): unknown {
  return JSON.parse(Buffer.from(s, 'base64url').toString('utf8'));
}

/** Build a fake Request with a given cookie string. */
function makeRequest(cookieHeader: string): Request {
  return new Request('http://localhost/', {
    headers: { cookie: cookieHeader },
  });
}

// ─── Environment setup ────────────────────────────────────────────────────────

beforeEach(() => {
  // Use a deterministic 48-char secret so tests are hermetic.
  process.env.AUTH_SECRET = 'test-secret-that-is-long-enough-for-hs256-tests!!';
  (process.env as Record<string, string>).NODE_ENV = 'test';
});

// ─── signSession ─────────────────────────────────────────────────────────────

describe('signSession', () => {
  it('returns a three-part JWT string', () => {
    const token = signSession('alice');
    expect(token.split('.')).toHaveLength(3);
  });

  it('encodes the correct username in sub', () => {
    const token = signSession('alice');
    const [, payloadB64] = token.split('.');
    const payload = b64uDecode(payloadB64) as { sub: string };
    expect(payload.sub).toBe('alice');
  });

  it('sets iat to approximately now', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = signSession('alice');
    const after = Math.floor(Date.now() / 1000);
    const [, payloadB64] = token.split('.');
    const { iat } = b64uDecode(payloadB64) as { iat: number };
    expect(iat).toBeGreaterThanOrEqual(before);
    expect(iat).toBeLessThanOrEqual(after);
  });

  it('sets exp 7 days in the future', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = signSession('alice');
    const [, payloadB64] = token.split('.');
    const { exp } = b64uDecode(payloadB64) as { exp: number };
    const sevenDays = 60 * 60 * 24 * 7;
    expect(exp).toBeGreaterThanOrEqual(before + sevenDays - 2);
    expect(exp).toBeLessThanOrEqual(before + sevenDays + 2);
  });

  it('header specifies HS256', () => {
    const [headerB64] = signSession('alice').split('.');
    const header = b64uDecode(headerB64) as { alg: string; typ: string };
    expect(header.alg).toBe('HS256');
    expect(header.typ).toBe('JWT');
  });
});

// ─── verifySession ────────────────────────────────────────────────────────────

describe('verifySession', () => {
  it('round-trips: verify accepts a freshly signed token', () => {
    const token = signSession('alice');
    const payload = verifySession(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('alice');
  });

  it('returns null for a token signed with a different secret', () => {
    const token = signSession('alice');
    process.env.AUTH_SECRET = 'completely-different-secret-also-long-enough!!!!!';
    expect(verifySession(token)).toBeNull();
  });

  it('returns null for a tampered payload', () => {
    const [header, , sig] = signSession('alice').split('.');
    const evil = Buffer.from(JSON.stringify({ sub: 'admin', iat: 0, exp: 9999999999 })).toString('base64url');
    expect(verifySession(`${header}.${evil}.${sig}`)).toBeNull();
  });

  it('returns null for a tampered signature', () => {
    const [header, payload] = signSession('alice').split('.');
    const badSig = Buffer.from('not-a-real-signature').toString('base64url');
    expect(verifySession(`${header}.${payload}.${badSig}`)).toBeNull();
  });

  it('returns null for an expired token', () => {
    const token = signSession('alice');
    const [_header, payloadB64, _sig] = token.split('.');
    const payload = b64uDecode(payloadB64) as Record<string, unknown>;
    // Back-date expiry to 1 second ago
    payload.exp = Math.floor(Date.now() / 1000) - 1;
    const _expiredPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    // This has a bad signature now — we need to re-sign it to test expiry specifically
    // So use signSession with a fake clock instead
    const realDateNow = Date.now;
    Date.now = () => Date.parse('2020-01-01T00:00:00Z'); // far in the past
    const oldToken = signSession('alice');
    Date.now = realDateNow;
    expect(verifySession(oldToken)).toBeNull();
  });

  it('returns null for a token with only two parts', () => {
    expect(verifySession('header.payload')).toBeNull();
  });

  it('returns null for a token with four parts', () => {
    expect(verifySession('a.b.c.d')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(verifySession('')).toBeNull();
  });

  it('returns null for totally invalid base64', () => {
    expect(verifySession('!!!.!!!.!!!')).toBeNull();
  });

  it('returns the full payload on success', () => {
    const token = signSession('smriti');
    const payload = verifySession(token);
    expect(payload?.sub).toBe('smriti');
    expect(typeof payload?.iat).toBe('number');
    expect(typeof payload?.exp).toBe('number');
  });
});

// ─── Cookie helpers ───────────────────────────────────────────────────────────

describe('scoped tokens', () => {
  it('round-trips a token for the expected scope', () => {
    const token = signScopedToken('private-letter', 60);
    expect(verifyScopedToken(token, 'private-letter')).toBe(true);
  });

  it('rejects a token for a different scope', () => {
    const token = signScopedToken('private-letter', 60);
    expect(verifyScopedToken(token, 'other-scope')).toBe(false);
  });

  it('rejects a forged literal unlock value', () => {
    expect(verifyScopedToken('1', 'private-letter')).toBe(false);
  });

  it('rejects expired scoped tokens', () => {
    const realDateNow = Date.now;
    let token = '';
    try {
      Date.now = () => Date.parse('2020-01-01T00:00:00Z');
      token = signScopedToken('private-letter', 60);
    } finally {
      Date.now = realDateNow;
    }
    expect(verifyScopedToken(token, 'private-letter')).toBe(false);
  });
});

describe('sessionCookieHeader', () => {
  it('includes the session cookie name', () => {
    const header = sessionCookieHeader('mytoken');
    expect(header).toContain(`${SESSION_COOKIE}=`);
  });

  it('is HttpOnly', () => {
    expect(sessionCookieHeader('t')).toContain('HttpOnly');
  });

  it('has SameSite=Lax', () => {
    expect(sessionCookieHeader('t')).toContain('SameSite=Lax');
  });

  it('URL-encodes the token value', () => {
    // Tokens are base64url and contain dots — they must be encoded
    const token = 'head.pay.sig';
    const header = sessionCookieHeader(token);
    expect(header).toContain(encodeURIComponent(token));
  });
});

describe('clearSessionCookieHeader', () => {
  it('sets Max-Age=0', () => {
    expect(clearSessionCookieHeader()).toContain('Max-Age=0');
  });

  it('uses the correct cookie name', () => {
    expect(clearSessionCookieHeader()).toContain(SESSION_COOKIE);
  });
});

// ─── getTokenFromRequest ──────────────────────────────────────────────────────

describe('getTokenFromRequest', () => {
  it('extracts the session token from a cookie header', () => {
    const token = signSession('alice');
    const req = makeRequest(`${SESSION_COOKIE}=${encodeURIComponent(token)}`);
    expect(getTokenFromRequest(req)).toBe(token);
  });

  it('returns null when the session cookie is absent', () => {
    const req = makeRequest('other_cookie=value');
    expect(getTokenFromRequest(req)).toBeNull();
  });

  it('returns null when the cookie header is empty', () => {
    const req = makeRequest('');
    expect(getTokenFromRequest(req)).toBeNull();
  });

  it('handles a cookie string with multiple cookies', () => {
    const token = signSession('alice');
    const req = makeRequest(`foo=bar; ${SESSION_COOKIE}=${encodeURIComponent(token)}; baz=qux`);
    expect(getTokenFromRequest(req)).toBe(token);
  });
});
