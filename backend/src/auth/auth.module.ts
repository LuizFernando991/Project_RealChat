import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { RefreshStrategy } from './strategies/refresh.strategy'
import { JwtWsStrategy } from './strategies/ws.strategy'

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshStrategy,
    JwtWsStrategy
  ]
})
export class AuthModule {}
