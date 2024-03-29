import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { serverEnv } from './lib/env.validation'
import '../../../types/lib/next-auth'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: [serverEnv.NEXT_PUBLIC_WEB_URL] })
  await app.listen(4000)
}
bootstrap()
