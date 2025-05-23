import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { createEnv, serverEnv } from '@server/src/lib/env.validation'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@server/src/app/auth/auth.module'
import { PostgresModule } from 'nest-postgres'
import { AuthMiddleware } from '@server/src/lib/middlewares/auth.middleware'
import { UserMiddleware } from '@server/src/lib/middlewares/user.middleware'
import { AdminMiddleware } from '@server/src/lib/middlewares/admin.middleware'
import { GeneralModule } from './general/general.module'
import { UserModule } from './user/user.module'
import { FamilyMemberModule } from './family-member/family-member.module'
import { AdminModule } from './admin/admin.module'
import { RequestModule } from './request/request.module'
import { MessageSocketModule } from './message-socket/message-socket.module'
import { MessageModule } from './message/message.module'
import { PaypalModule } from './payment/paypal/paypal.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: createEnv,
    }),
    PostgresModule.forRoot({
      connectionString: serverEnv.DATABASE_URL,
    }),
    AuthModule,
    GeneralModule,
    UserModule,
    FamilyMemberModule,
    AdminModule,
    RequestModule,
    MessageSocketModule,
    MessageModule,
    PaypalModule,
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
