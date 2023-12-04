import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayloadWithRefreshToken } from 'src/auth/types/JwtPayloadWithRefreshType'
import { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadWithRefreshToken => {
    const request = context.switchToHttp().getRequest<Request>()

    return request.user
  }
)
