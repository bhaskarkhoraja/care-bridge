import { Module } from '@nestjs/common'
import { AuthService } from '@server/src/app/auth/auth.service'
import { AuthController } from '@server/src/app/auth/auth.controller'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
