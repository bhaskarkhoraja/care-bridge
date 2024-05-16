"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "api-contract"

export async function getAllMessages(status: "open" | "close" | "spam") {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.message.getAllMessages({
    query: {
      status: status,
    },
  })
}

export async function getMessage(senderId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.message.getMessage({ params: { id: senderId } })
}

export async function getSenderDetails(senderId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.message.getSenderDetails({ params: { id: senderId } })
}

export async function markMessages(
  senderId: string,
  status: "open" | "close" | "spam"
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.message.markMessages({
    body: { senderId: senderId, status: status },
  })
}
