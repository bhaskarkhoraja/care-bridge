import { AppRouter } from "@server/trpc/trpc.router"
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"

import { webEnv } from "../lib/env.mjs"

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${webEnv.SERVER_URL}/trpc`,
    }),
  ],
})
