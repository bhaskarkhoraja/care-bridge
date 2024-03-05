import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { createEnv } from '@server/lib/env.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TrpcModule,
    ConfigModule.forRoot({
      validate: createEnv,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
