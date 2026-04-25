import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Proxy runs in the Edge runtime — we cannot use Node.js crypto here.
// We check cookie *presence* only; full JWT verification happens in each
// API route / Server Component via lib/auth.ts (Node.js runtime).
// This is a standard Next.js pattern: proxy as a UX gate, server code
// as the security gate.

// NOTE: Cannot import from lib/auth (Edge runtime excludes Node.js crypto).
// Keep in sync with SESSION_COOKIE in lib/auth.ts
const SESSION_COOKIE = 'yor_session';

// Paths that are always public — no session required
// NOTE: /api/admin/* and /admin are NOT listed here — they require authentication.
// The proxy redirects unauthenticated requests to /login.
const PUBLIC_PREFIXES = [
  '/login',
  '/api/login',
  '/api/health',
  '/api/metrics',
  '/_next',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Always allow public paths through
  if (isPublic(pathname)) return NextResponse.next();

  // Check for session cookie
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) {
    // Redirect to /login, preserving the intended destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Match everything except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|public/|icons/|favicon\\.ico).*)',
  ],
};
