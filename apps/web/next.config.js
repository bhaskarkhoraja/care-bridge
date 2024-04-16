import { fileURLToPath } from "node:url"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti("./src/lib/env")
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
}

export default nextConfig
