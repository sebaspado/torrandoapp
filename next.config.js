/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src'],
  },
  // Add page configurations
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Optimize builds
  compiler: {
    // Only remove console in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
}

module.exports = nextConfig 