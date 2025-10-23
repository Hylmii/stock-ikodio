/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@project-ikodiomain/ui", "@project-ikodiomain/utils"],
  experimental: {
    optimizePackageImports: ["@project-ikodiomain/ui"]
  }
};

module.exports = nextConfig;