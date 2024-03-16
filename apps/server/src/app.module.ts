import { Module } from '@nestjs/common'
import { createEnv } from '@server/lib/env.validation'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: createEnv,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
