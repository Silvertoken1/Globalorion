/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs", "jsonwebtoken", "nodemailer"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "bright-orion.vercel.app"],
    unoptimized: true,
  },
  output: "standalone",
}

module.exports = nextConfig
