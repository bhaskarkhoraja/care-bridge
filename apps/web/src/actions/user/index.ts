"use server"

import { cookies } from "next/headers"
import client from "@web/src/lib/ts-rest"
import { UserType } from "@web/src/types/user"
import {
  AddressContactFormSchema,
  DocumentFormSchema,
  PersonalInfoFormSchema,
} from "node_modules/api-contract/dist/types/user.mjs"
import { z } from "zod"

/**
 * Return the personal info of the profile
 **/
export async function getPersonalInfo() {
  return client.users.getPersonalInfo()
}

/**
 * Set the personal info of the profile
 **/
export async function setPersonalInfo(
  data: z.infer<typeof PersonalInfoFormSchema>
) {
  return client.users.setPersonalInfo({
    body: data,
  })
}

/**
 * Return the address info of the profile
 **/
export async function getAddressContactInfo() {
  return client.users.getAddressContactInfo()
}

/**
 * Set the Address & contact info of the profile
 **/
export async function setAddressContactInfo(
  data: z.infer<typeof AddressContactFormSchema>
) {
  return client.users.setAddressContactInfo({
    body: data,
  })
}

/**
 * Return the document info of the profile
 **/
export async function getDocumentInfo() {
  return client.users.getDocumentInfo()
}

/**
 * Set the personal info of the profile
 **/
export async function setDocumentInfo(
  data: z.infer<typeof DocumentFormSchema>
) {
  return client.users.setDocumentInfo({
    body: data,
  })
}

/**
 *
 **/
export async function switchBuyerSeller(): Promise<UserType> {
  const type = cookies().get("user-type")?.value

  if (type === "buyer" || type === undefined) {
    cookies().set("user-type", "seller", {
      path: "/",
      httpOnly: true,
      maxAge: Date.now() + 60 * 1000,
      sameSite: "lax",
    })
  }

  cookies().set("user-type", "buyer", {
    path: "/",
    httpOnly: true,
    maxAge: Date.now() + 60 * 1000,
    sameSite: "lax",
  })

  return type === "buyer" ? "seller" : "buyer"
}
