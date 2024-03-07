import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const clientEnv = createEnv({
  server: {
    API_URL: z.string().min(1),
  },
})
