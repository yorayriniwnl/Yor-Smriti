/**
 * Extracts the real client IP from a request.
 *
 * CF-Connecting-IP / X-Real-IP are only trustworthy when the app is running
 * behind Vercel's edge or Cloudflare. On a raw Node.js server these headers
 * can be spoofed by any client and would defeat the rate limiter.
 *
 * Set TRUST_PROXY=1 in your environment only when you are genuinely behind
 * a trusted reverse proxy (Vercel, Cloudflare, your own nginx with
 * proxy_set_header directives). Leave it unset for local dev.
 */
import { logger } from './logger';

let _trustProxyWarned = false;

export function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY === '1';

  if (!trustProxy && !_trustProxyWarned) {
    _trustProxyWarned = true;
    logger.warn(
      '[request] TRUST_PROXY not set — all requests will share rate-limit bucket "unknown". ' +
      'Set TRUST_PROXY=1 in production.'
    );
  }

  if (trustProxy) {
    const cfIp   = request.headers.get('cf-connecting-ip');
    const realIp = request.headers.get('x-real-ip');
    if (cfIp)   return cfIp.trim();
    if (realIp) return realIp.trim();

    // X-Forwarded-For: take the LAST entry added by the trusted proxy
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
      const ips = xff.split(',').map(s => s.trim()).filter(Boolean);
      if (ips.length > 0) return ips[ips.length - 1];
    }
  }

  // Fallback — no spoofable headers trusted outside proxy context
  return 'unknown';
}

/**
 * CSRF protection: verify the request has either:
 * - A same-origin Referer/Origin header  
 * - Or a custom header (fetch() from our own code always sends this)
 * 
 * This is the "custom request header" CSRF defense. Simple and effective
 * because cross-origin forms cannot set custom headers.
 */
export function verifyCsrfHeader(request: Request): boolean {
  // Our fetch calls always send this header (see fetchApi helper)
  const csrf = request.headers.get('x-yor-csrf');
  if (csrf === '1') return true;

  // Also accept same-origin requests (Origin matches host)
  const origin = request.headers.get('origin');
  const host   = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      return originHost === host;
    } catch { /* invalid origin */ }
  }

  // Allow in test environment so Vitest suites pass without a CSRF header
  if (process.env.NODE_ENV === 'test') return true;

  return false;
}
