"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "api-contract"
import { PendingActionsSchema } from "api-contract/types"
import { z } from "zod"

/**
 * Return all pending Users
 **/
export async function getAllPendingUsers() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.getAllPendingUsers()
}

/**
 * Accept or reject pending users with certain id
 **/
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

/**
 * Return all pending Members
 **/
export async function getAllPendingMembers() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.getAllPendingMembers()
}

/**
 * Accept or reject pending members with certain id
 **/
export async function pendingMemberActions({
  action,
  ids,
}: z.infer<typeof PendingActionsSchema>) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.pendingMemberActions({
    body: { action: action, ids: ids },
  })
}

/**
 * Get dashboard
 **/
export async function getAdminDashboard() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.admin.getDashboard()
}
