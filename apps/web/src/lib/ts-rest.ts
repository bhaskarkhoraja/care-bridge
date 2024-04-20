import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import contract from "api-contract"

import { webEnv } from "./env"

const secureCookie =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL
const cookieName = secureCookie
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token"

const client = initClient(contract, {
  baseUrl: webEnv.SERVER_URL,
  baseHeaders: {
    cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
  },
})

export default client
