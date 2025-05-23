import { ourFileRouter } from "@web/src/lib/uploadthing/core"
import { createRouteHandler } from "uploadthing/next"

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    isDev: true,
  },
})
