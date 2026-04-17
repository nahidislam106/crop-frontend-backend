/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable image optimization for Netlify deployment
    domains: [],
  },
  // Optimize build for faster deploys
  swcMinify: true,
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  // Configure static generation
  staticPageGenerationTimeout: 120, // seconds
};

module.exports = nextConfig;
