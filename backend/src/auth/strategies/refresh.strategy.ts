import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { UnauthorizedException, Injectable } from '@nestjs/common'
import { JwtPayload } from '../types/JwtPayloadType'
import { JwtPayloadWithRefreshToken } from '../types/JwtPayloadWithRefreshType'

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()

    if (!refreshToken) throw new UnauthorizedException('invalid refresh token')

    return {
      ...payload,
      refreshToken
    }
  }
}
