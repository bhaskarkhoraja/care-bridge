import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets'
import { MessageSocketService } from './message-socket.service'
import { Server } from 'socket.io'
import z from 'zod'
import { MessageSchema } from 'packages/api-contract/dist/types'

@WebSocketGateway()
export class MessageSocketGateway {
  constructor(private readonly messageService: MessageSocketService) {}

  @WebSocketServer()
  // @ts-expect-error need to figure this out later
  io: Server

  @SubscribeMessage('sendMessage')
  create(@MessageBody() message: z.infer<typeof MessageSchema>) {
    this.io.emit('recieveMessage', message)
    return this.messageService.create()
  }
}
