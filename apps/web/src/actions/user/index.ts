"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import {
  AddressContactFormSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
  UserTypeSchema,
} from "node_modules/api-contract/dist/types/user.mjs"
import contract from "packages/api-contract/dist/index.mjs"
import { z } from "zod"

/**
 * Return the personal info of the profile
 **/
export async function getPersonalInfo() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getPersonalInfo()
}

/**
 * Set the personal info of the profile
 **/
export async function setPersonalInfo(
  data: z.infer<typeof PersonalInfoFormSchema>
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.setPersonalInfo({
    body: data,
  })
}

/**
 * Return the address info of the profile
 **/
export async function getAddressContactInfo() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getAddressContactInfo()
}

/**
 * Set the Address & contact info of the profile
 **/
export async function setAddressContactInfo(
  data: z.infer<typeof AddressContactFormSchema>
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.setAddressContactInfo({
    body: data,
  })
}

/**
 * Return the document info of the profile
 **/
export async function getDocumentInfo() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getDocumentInfo()
}

/**
 * Set the personal info of the profile
 **/
export async function setDocumentInfo(
  data: z.infer<typeof DocumentFormSchema>
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.setDocumentInfo({
    body: data,
  })
}

/**
 *
 **/
export async function setUserType(data: z.infer<typeof UserTypeSchema>) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.setUserType({
    body: data,
  })
}
