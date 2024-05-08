"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import { webEnv } from "@web/src/lib/env"
import { cookieName } from "@web/src/lib/utils"
import contract from "api-contract"
import {
  DocumentFormSchema,
  FamilyInfoFormSchema,
  FamilySpecialNeedsSchema,
} from "api-contract/types"
import { z } from "zod"

/**
 * Get the family member info of the profile
 **/
export async function getFamilyMemberInfo(familyMemberId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.getFamilyMemberInfo({ params: { id: familyMemberId } })
}

/**
 * Set the family member info of the profile
 **/
export async function setFamilyMemberInfo(
  data: z.infer<typeof FamilyInfoFormSchema>,
  familyMemberId: string
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.setFamilyMemberInfo({
    body: {
      data: data,
      familyMemberId: familyMemberId,
    },
  })
}

/**
 * Get the family member special need
 **/
export async function getFamilySpecialNeed(familyMemberId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.getFamilySpecialNeed({ params: { id: familyMemberId } })
}

/**
 * Set the family member special need
 **/
export async function setFamilySpecialNeed(
  data: z.infer<typeof FamilySpecialNeedsSchema>,
  familyMemberId: string
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.setFamilySpecialNeed({
    body: {
      data: data,
      familyMemberId: familyMemberId,
    },
  })
}

/**
 * Get the family document info
 **/
export async function getFamilyDocumentInfo(familyMemberId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.getFamilyDocumentInfo({ params: { id: familyMemberId } })
}

/**
 * Set the family document info
 **/
export async function setFamilyDocumentInfo(
  data: z.infer<typeof DocumentFormSchema>,
  familyMemberId: string
) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.setFamilyDocumentInfo({
    body: {
      data: data,
      familyMemberId: familyMemberId,
    },
  })
}

/**
 * Get all family member info
 **/
export async function getAllFamilyMemberInfo() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.getAllFamilyMemberInfo()
}

/**
 * Check if user can edit or update
 **/
export async function checkFamilyMemberEditable(familyMemberId: string) {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  return client.family.checkFamilyMemberEditable({
    params: { id: familyMemberId },
  })
}
