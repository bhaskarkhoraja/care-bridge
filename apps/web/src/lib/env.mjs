import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const clientEnv = createEnv({
  server: {
    WEB_URL: z.string().url(),
    SERVER_URL: z.string().url(),
  },
})
