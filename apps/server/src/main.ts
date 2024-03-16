import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TrpcRouter } from './trpc/trpc.router'
import { serverEnv } from './lib/env.validation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({ origin: [serverEnv.NEXT_PUBLIC_WEB_URL] })
  const trpc = app.get(TrpcRouter)
  trpc.applyMiddleware(app)
  await app.listen(4000)
}
bootstrap()
