import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { serverEnv } from '@server/src/lib/env.validation'
import cookieParser from 'cookie-parser'
import { IoAdapterWithUserName } from '../lib/socket-adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: [serverEnv.NEXT_PUBLIC_WEB_URL] })
  app.use(cookieParser())
  app.useWebSocketAdapter(new IoAdapterWithUserName(app))
  await app.listen(4000)
}
bootstrap()
