import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { createEnv, serverEnv } from '@server/src/lib/env.validation'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@server/src/app/auth/auth.module'
import { PostgresModule } from 'nest-postgres'
import { AuthMiddleware } from '@server/src/lib/middlewares/auth.middleware'
import { UserMiddleware } from '@server/src/lib/middlewares/user.middleware'
import { AdminMiddleware } from '@server/src/lib/middlewares/admin.middleware'

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
    consumer.apply(UserMiddleware).forRoutes('user')
    consumer.apply(AdminMiddleware).forRoutes('admin')
  }
}
