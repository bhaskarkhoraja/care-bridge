import { IoAdapter } from '@nestjs/platform-socket.io'
import { NextFunction } from 'express'
import { Socket } from 'socket.io'

export class IoAdapterWithUserName extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: true,
      path: '/user/message/socket.io',
    })
    server.use((socket: Socket, next: NextFunction) => {
      const username = socket.handshake.auth.username
      if (!username) {
        return next(new Error('invalid username'))
      }
      socket.username = username
      next()
    })
    return server
  }
}
