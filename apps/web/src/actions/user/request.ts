"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "api-contract"
import { RequestSchema } from "api-contract/types"
import { z } from "zod"

/**
 * Add Request
 **/
export async function createRequest(request: z.infer<typeof RequestSchema>) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.request.createRequest({ body: request })
}

/**
 * Get all seller request
 **/
export async function getMyRequest() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.request.getMyRequest()
}

/**
 * Get specific request
 **/
export async function getRequest(requestId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.request.getRequest({ params: { id: requestId } })
}

/**
 * Get request for seller
 **/
export async function getRequestForSeller() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.request.getRequestForSeller()
}

/**
 * Apply for request
 **/
export async function applyForRequest(requestId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.request.applyForRequest({ body: { requestId: requestId } })
}
