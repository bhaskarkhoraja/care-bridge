/** @type {import('next').NextConfig} */
import "./src/lib/env.mjs"

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
