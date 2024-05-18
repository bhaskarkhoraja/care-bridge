import { Module } from '@nestjs/common'
import { PaypalService } from './paypal.service'
import { PaypalController } from './paypal.controller'
import { UserService } from '@server/src/app/user/user.service'

@Module({
  controllers: [PaypalController],
  providers: [PaypalService, UserService],
})
export class PaypalModule {}
