import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Edge-runtime constraint ──────────────────────────────────────────────────
// Next.js Proxy runs exclusively on the Edge runtime. The Edge runtime does
// NOT support Node.js built-ins such as node:crypto. Therefore:
//   • We CANNOT import from lib/auth.ts (which uses crypto.createHmac).
//   • We check cookie PRESENCE only — not JWT validity.
//
// This is the correct, standard Next.js pattern:
//   Proxy = UX gate (fast, runs on every request at the CDN edge)
//   Server Components / API routes = security gate (full JWT verification via
//     lib/auth.ts, which runs in the Node.js runtime where crypto is available)
//
// The session cookie name is duplicated here intentionally — importing it from
// lib/auth would pull in the crypto module and crash the Edge runtime.
// Keep this constant in sync with SESSION_COOKIE in lib/auth.ts.
const SESSION_COOKIE = 'yor_session';

// ─── Routes that never require authentication ─────────────────────────────────
const PUBLIC_PATHS = new Set([
  '/login',
  '/api/login',
  '/api/logout',
  '/api/health',
  '/api/metrics',
]);

// Prefixes that are always public (static assets, Next internals, icons)
const PUBLIC_PREFIXES = [
  '/_next/',
  '/icons/',
  '/workers/',
  '/textures/',
  '/models/',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon',
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ─── Private letter unlock cookie ────────────────────────────────────────────
// /for-her-alone/content is a server component containing the private letter.
// It is gated by the `her_unlocked` HttpOnly cookie set by /api/her-unlock on
// successful password entry. Proxy checks cookie presence here (UX layer);
// the server component performs the authoritative check before rendering.
const HER_UNLOCK_COOKIE = 'her_unlocked';

function isHerContentPath(pathname: string): boolean {
  return pathname === '/for-her-alone/content' || pathname.startsWith('/for-her-alone/content/');
}

// ─── Admin paths ──────────────────────────────────────────────────────────────
// Proxy cannot verify the JWT in the Edge runtime, so it cannot check the
// admin role here. Admin role enforcement happens in the server-side handlers
// (app/admin/page.tsx and /api/admin/stats/route.ts via lib/auth.ts).
// Proxy still gates unauthenticated requests to admin paths — it just
// cannot distinguish "authenticated non-admin" from "authenticated admin" at
// this layer.
function isAdminPath(pathname: string): boolean {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/api/admin/stats' ||
    pathname.startsWith('/api/admin/')
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths through without a session check
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check for the presence of the session cookie.
  // We do NOT verify the JWT here — that happens in lib/auth.ts (Node runtime).
  // An absent cookie means definitely unauthenticated.
  // A present but invalid cookie will be caught by server-side code.
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (!hasSession) {
    // API routes: return 401 JSON so fetch() callers can handle it gracefully
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required.' },
        { status: 401 },
      );
    }

    // Page routes: redirect to /login, preserving the intended destination
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie is present — pass through. Admin role checks happen
  // server-side where full JWT verification is available.
  if (isAdminPath(pathname)) {
    return NextResponse.next();
  }

  // Private letter content gate: requires BOTH yor_session AND her_unlocked.
  // If the unlock cookie is absent, redirect to the password gate.
  if (isHerContentPath(pathname)) {
    const hasUnlock = Boolean(request.cookies.get(HER_UNLOCK_COOKIE)?.value);
    if (!hasUnlock) {
      const gateUrl = request.nextUrl.clone();
      gateUrl.pathname = '/for-her-alone';
      gateUrl.search = '';
      return NextResponse.redirect(gateUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js static internals
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
