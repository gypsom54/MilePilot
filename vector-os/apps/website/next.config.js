/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vector-os/ui', '@vector-os/design-system', '@vector-os/icons', '@vector-os/utils', '@vector-os/types'],
};

module.exports = nextConfig;
