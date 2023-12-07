import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FriendshipModule } from './friendship/friendship.module'
import { ConversationModule } from './conversation/conversation.module'
import { GatewayModule } from './events/events.module'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    FriendshipModule,
    ConversationModule,
    GatewayModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [],
  providers: [PrismaModule]
})
export class AppModule {}
