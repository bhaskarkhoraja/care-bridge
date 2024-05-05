"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "packages/api-contract/dist/index.mjs"
import { PendingActionsSchema } from "packages/api-contract/dist/types/index.mjs"
import { z } from "zod"

export async function getAllPendingUsers() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.getAllPendingUsers()
}

export async function pendingUserActions({
  action,
  ids,
}: z.infer<typeof PendingActionsSchema>) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.pendingUserActions({
    body: { action: action, ids: ids },
  })
}
