import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'unsafe-eval' removed (Issue 15) — it defeats XSS protection entirely.
      // Three.js and Framer Motion do not require it. If a future dependency
      // breaks at runtime with CSP errors pointing to eval/new Function, identify
      // the specific module and apply a nonce-based approach instead of re-adding
      // the blanket directive.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      // connect-src: all third-party calls (OpenAI, Upstash, Resend) are
      // server-side, so 'self' is correct today. If you add client-side
      // fetches to external origins (analytics, CDN APIs) you MUST extend
      // this directive or browsers will silently block those requests.
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-src 'self'",
      "worker-src 'self' blob:",
      "media-src 'self' blob:",
      "frame-ancestors 'self'",
    ].join('; '),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // instrumentation.ts is supported natively in Next.js 15+ without experimental flag
  images: { remotePatterns: [] },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
