import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class JwtWsAuthGuard extends AuthGuard('wsjwt') {
  getRequest(context: ExecutionContext) {
    const ws = context.switchToWs().getClient()
    const { authorization } = ws.handshake.headers
    return {
      headers: {
        Authorization: authorization
      }
    }
  }
}
