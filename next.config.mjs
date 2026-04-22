import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // instrumentation.ts is supported natively in Next.js 15+ without experimental flag
  images: { remotePatterns: [] },
};

export default withBundleAnalyzer(nextConfig);
