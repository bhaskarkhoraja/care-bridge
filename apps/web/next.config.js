import { fileURLToPath } from "node:url"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti("./src/lib/env")
/** @type {import('next').NextConfig} */

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
