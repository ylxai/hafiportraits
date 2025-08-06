/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cloudflare Pages configuration
  images: {
    unoptimized: true, // Required for production
    domains: ['localhost', 'api.qrserver.com', 'azspktldiblhrwebzmwq.supabase.co', 'ipvhepiuwpol.ap-southeast-1.clawcloudrun.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig 