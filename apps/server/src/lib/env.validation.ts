import { z } from 'zod';

// Schema for server environment variables
// Might move later to seperate folder

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string(),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  APP_PORT: z.coerce.number().positive(),
  API_PORT: z.coerce.number().positive(),
});

export let serverEnv: z.infer<typeof serverEnvSchema> = {
  DATABASE_URL: '',
  APP_URL: '',
  API_URL: '',
  APP_PORT: 0,
  API_PORT: 0,
};

export function createEnv(config: Record<string, any>) {
  const env = {
    DATABASE_URL: config.DATABASE_URL,
    APP_URL: config.APP_URL,
    API_URL: config.API_URL,
    APP_PORT: config.APP_PORT,
    API_PORT: config.API_PORT,
  };

  const validatedConfig = serverEnvSchema.safeParse(env);

  if (!validatedConfig.success) {
    console.error(
      '❌ Invalid environment variables:',
      validatedConfig.error.flatten().fieldErrors,
    );
    throw new Error('Invalid environment variables');
  }
  serverEnv = env;
  return env;
}
