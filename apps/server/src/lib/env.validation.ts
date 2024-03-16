import { z } from 'zod'

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string(),
  NEXT_PUBLIC_WEB_URL: z.string().url(),
  SERVER_URL: z.string().url(),
})

export let serverEnv: z.infer<typeof serverEnvSchema> = {
  DATABASE_URL: '',
  NEXT_PUBLIC_WEB_URL: '',
  SERVER_URL: '',
}

export function createEnv(config: Record<string, any>) {
  const env = {
    DATABASE_URL: config.DATABASE_URL,
    NEXT_PUBLIC_WEB_URL: config.NEXT_PUBLIC_WEB_URL,
    SERVER_URL: config.SERVER_URL,
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
