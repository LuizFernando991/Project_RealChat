import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { FriendshipModule } from './friendship/friendship.module'

@Module({
  imports: [PrismaModule, UserModule, AuthModule, FriendshipModule],
  controllers: [],
  providers: [PrismaModule]
})
export class AppModule {}
