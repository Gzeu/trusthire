/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Exclude backup directory from build
    outputFileTracingExcludes: {
      '*': ['lib/backup-disabled/**/*'],
    },
  },
}

module.exports = nextConfig
