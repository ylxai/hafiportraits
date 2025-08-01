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
    unoptimized: true, // Required for Cloudflare Pages
    domains: ['localhost', 'api.qrserver.com', 'your-supabase-url.supabase.co'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig 