"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "api-contract"
import {
  AddressContactFormSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
  UserTypeSchema,
} from "api-contract/types"
import { z } from "zod"

/**
 * Return the personal info of the profile
 **/
export async function getPersonalInfo(profileId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getPersonalInfo({ params: { id: profileId } })
}

/**
 * Set the personal info of the profile
 **/
export async function setPersonalInfo(
  data: z.infer<typeof PersonalInfoFormSchema>,
  profileId: string
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.setPersonalInfo({
    body: { data: data, profileId: profileId },
  })
}

/**
 * Return the address info of the profile
 **/
export async function getAddressContactInfo(profileId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getAddressContactInfo({ params: { id: profileId } })
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
export async function getDocumentInfo(profileId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getDocumentInfo({ params: { id: profileId } })
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

/**
 * get user dashboard
 **/
export async function getUserDashboard() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.users.getDashboard()
}
