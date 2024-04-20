import { initContract } from "@ts-rest/core"
import { z } from "zod"

import { CountriesSchema } from "../types/general"

const c = initContract()

/**
 * General contracts
 **/
export const generalContract = c.router({
  /**
   * Get list of countries
   **/
  getCountries: {
    method: "GET",
    path: "/get-countries",
    responses: {
      200: z.object({
        status: z.literal(true),
        data: z.array(CountriesSchema),
      }),
      204: z.object({
        status: z.literal(true),
        message: z.literal("No countries found"),
      }),
    },
    summary: "Get list of country and its data",
  },
})
