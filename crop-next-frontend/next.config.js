/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable image optimization for deployment
    domains: [],
  },
  // Optimize build for faster deploys
  productionBrowserSourceMaps: false,
  // Configure static generation
  staticPageGenerationTimeout: 120, // seconds
};

module.exports = nextConfig;
