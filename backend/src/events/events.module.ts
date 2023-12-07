import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { JwtModule } from '@nestjs/jwt'
import { GatewaySessionManager } from './events.sessions'

@Module({
  imports: [JwtModule],
  providers: [EventsGateway, GatewaySessionManager]
})
export class GatewayModule {}
