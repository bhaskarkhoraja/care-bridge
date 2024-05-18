import { z } from 'zod'

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_WEB_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  PAYPAL_CLIENT_ID: z.string(),
  PAYPAL_CLIENT_SECRET: z.string(),
  PAYPAL_URL: z.string().url(),
  PAYPAL_PARTNER_ID: z.string(),
})

export let serverEnv: z.infer<typeof serverEnvSchema> = {
  DATABASE_URL: '',
  NEXT_PUBLIC_WEB_URL: '',
  SERVER_URL: '',
  NEXTAUTH_SECRET: '',
  PAYPAL_CLIENT_ID: '',
  PAYPAL_CLIENT_SECRET: '',
  PAYPAL_URL: '',
  PAYPAL_PARTNER_ID: '',
}

export function createEnv(config: Record<string, any>) {
  const env = {
    DATABASE_URL: config.DATABASE_URL,
    NEXT_PUBLIC_WEB_URL: config.NEXT_PUBLIC_WEB_URL,
    SERVER_URL: config.SERVER_URL,
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET,
    PAYPAL_CLIENT_ID: config.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: config.PAYPAL_CLIENT_SECRET,
    PAYPAL_URL: config.PAYPAL_URL,
    PAYPAL_PARTNER_ID: config.PAYPAL_PARTNER_ID,
  }

  const validatedConfig = serverEnvSchema.safeParse(env)

  if (!validatedConfig.success) {
    console.error(
      '❌ Invalid environment variables:',
      validatedConfig.error.flatten().fieldErrors,
    )
    throw new Error('Invalid environment variables')
  }
  serverEnv = env
  return env
}
