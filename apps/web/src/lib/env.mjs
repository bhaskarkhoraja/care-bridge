import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const webEnv = createEnv({
  server: {
    SERVER_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_WEB_URL: z.string().url(),
  },
  runtimeEnv: {
    SERVER_URL: process.env.SERVER_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
})
