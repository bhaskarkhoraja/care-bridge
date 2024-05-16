import { Module } from '@nestjs/common'
import { MessageSocketService } from './message-socket.service'
import { MessageSocketGateway } from './message-socket.gateway'

@Module({
  providers: [MessageSocketGateway, MessageSocketService],
})
export class MessageSocketModule {}
