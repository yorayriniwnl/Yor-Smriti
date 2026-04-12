import path from 'path';
import { fileURLToPath } from 'url';
import bundleAnalyzer from '@next/bundle-analyzer';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  experimental: {
    // Turbopack's persistent dev cache has been intermittently crashing in this workspace.
    turbopackFileSystemCacheForDev: false,
  },
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? path.resolve(__dirname, '.next', 'analyze', 'nodejs.html')
            : path.resolve(__dirname, '.next', 'analyze', 'client.html'),
          generateStatsFile: true,
          statsFilename: isServer
            ? path.resolve(__dirname, '.next', 'analyze', 'nodejs-stats.json')
            : path.resolve(__dirname, '.next', 'analyze', 'client-stats.json'),
        })
      );
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
