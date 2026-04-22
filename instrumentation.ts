/**
 * Next.js instrumentation hook — runs once at server startup.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Used to validate environment variables at boot time so misconfigured
 * deployments fail loudly instead of silently serving broken requests.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only run in the Node.js runtime (not Edge runtime)
    const { requireEnv } = await import('@/lib/env');
    requireEnv();
  }
}
