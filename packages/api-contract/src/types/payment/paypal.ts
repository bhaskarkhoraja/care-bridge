import z from "zod"

export const paypalPartnerReferalResponseSchema = z.discriminatedUnion(
  "status",
  [
    z.object({ status: z.literal(true), actionUrl: z.string() }),
    z.object({ status: z.literal(false), message: z.string() }),
  ]
)
