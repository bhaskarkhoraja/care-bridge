/** @type {import('next').NextConfig} */
import "./src/lib/env.mjs"

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig
