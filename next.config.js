/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Required for Prisma + driver adapters to work on Cloudflare Workers via
  // @opennextjs/cloudflare — keeps the generated client out of the bundler
  // so its runtime files (incl. the wasm query engine) get copied as-is.
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
};

module.exports = nextConfig;
