/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vector-platform/ui', '@vector-platform/tokens', '@vector-platform/icons', '@vector-platform/utils', '@vector-platform/types'],
};

module.exports = nextConfig;
