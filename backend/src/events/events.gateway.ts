import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { GatewaySessionManager } from './events.sessions'
import { JwtPayload } from 'src/auth/types/JwtPayloadType'
import { OnEvent } from '@nestjs/event-emitter'

@WebSocketGateway({ namespace: 'events' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessions: GatewaySessionManager
  ) {}

  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    try {
      const user: JwtPayload = this.jwtService.verify(
        client.handshake.headers.authorization.split(' ')[1],
        {
          secret: process.env.ACCESS_TOKEN_SECRET
        }
      )
      // this.sessions.setUserSocket(user.sub, client)
      client.join(`${user.sub}-room`)
    } catch (err) {
      client._error({
        message: 'unauthorized'
      })
    }
  }

  handleDisconnect(client: Socket) {
    client._cleanup()
  }
}
