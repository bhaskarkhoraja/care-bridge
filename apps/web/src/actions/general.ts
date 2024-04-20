"use server"

import client from "@web/src/lib/ts-rest"

export default async function getCountries() {
  const countries = client.general.getCountries()
  return countries
}
