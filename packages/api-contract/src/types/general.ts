import { z } from "zod"

/**
 * Countries Schema
 **/
export const CountriesSchema = z.object({
  id: z.number(),
  name: z.string(),
  nationality: z.string(),
  short_name: z.string(),
  country_code: z.string(),
})
