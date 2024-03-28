import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { createEnv, serverEnv } from '@server/lib/env.validation'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PostgresModule } from 'nest-postgres'
import { AuthMiddleware } from './middlewares/auth.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: createEnv,
    }),
    PostgresModule.forRoot({
      connectionString: serverEnv.DATABASE_URL,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth')
  }
}
