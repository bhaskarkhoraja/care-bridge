import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { serverEnv } from '@server/src/lib/env.validation'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: [serverEnv.NEXT_PUBLIC_WEB_URL] })
  app.use(cookieParser())
  await app.listen(4000)
}
bootstrap()
