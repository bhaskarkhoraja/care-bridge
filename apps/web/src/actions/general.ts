"use server"

import { cookies } from "next/headers"
import { initClient } from "@ts-rest/core"
import contract from "packages/api-contract/dist/index.mjs"

import { webEnv } from "../lib/env"
import { cookieName } from "../lib/utils"

export default async function getCountries() {
  const client = initClient(contract, {
    baseUrl: webEnv.SERVER_URL,
    baseHeaders: {
      cookie: `${cookieName}=${cookies().get(cookieName)?.value}`,
    },
  })
  const countries = client.general.getCountries()
  return countries
}
