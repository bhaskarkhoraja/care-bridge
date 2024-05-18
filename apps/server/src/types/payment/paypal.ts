import z from 'zod'

export const generatePaypalTokenResponseSchema = z.discriminatedUnion(
  'status',
  [
    z.object({ status: z.literal(true), accessToken: z.string() }),
    z.object({ status: z.literal(false), message: z.string() }),
  ],
)

export const paypalRefralAndOrderResponseSchema = z.object({
  links: z.array(
    z.object({
      href: z.string().url(),
      rel: z.union([
        z.literal('self'),
        z.literal('action_url'),
        z.literal('payer-action'),
      ]),
      method: z.literal('GET'),
      description: z.string(),
    }),
  ),
})

export const partnerMerchantIntegrationResponseSchema = z.object({
  merchant_id: z.string(),
  tracking_id: z.string(),
  links: z.array(
    z.object({
      href: z.string(),
      rel: z.literal('get'),
      method: z.literal('GET'),
    }),
  ),
})
