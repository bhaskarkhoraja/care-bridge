import { Module } from '@nestjs/common'
import { createEnv } from '@server/lib/env.validation'
import { createEnv, serverEnv } from '@server/lib/env.validation'
import { ConfigModule } from '@nestjs/config'
import { PostgresModule } from 'nest-postgres'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: createEnv,
    }),
    PostgresModule.forRoot({
      connectionString: serverEnv.DATABASE_URL,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
