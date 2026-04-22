/**
 * Extracts the real client IP from a request.
 * 
 * Vercel sets CF-Connecting-IP (via Cloudflare) or X-Real-IP.
 * We trust these over X-Forwarded-For which is spoofable by clients.
 * 
 * IMPORTANT: In production on Vercel, the rightmost non-private IP
 * in X-Forwarded-For is the real client. But since we're behind Vercel's
 * proxy, X-Real-IP is already the real client IP.
 */
export function getClientIp(request: Request): string {
  // Vercel/Cloudflare inject these from their own infrastructure
  const cfIp   = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  
  if (cfIp)   return cfIp.trim();
  if (realIp) return realIp.trim();

  // X-Forwarded-For: take the LAST entry (added by our trusted proxy)
  // not the first (which could be spoofed by the client)
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const ips = xff.split(',').map(s => s.trim()).filter(Boolean);
    if (ips.length > 0) return ips[ips.length - 1];
  }

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

  // Allow in development without the header
  if (process.env.NODE_ENV !== 'production') return true;

  return false;
}
