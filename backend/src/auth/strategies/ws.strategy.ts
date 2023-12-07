import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { JwtPayload } from '../types/JwtPayloadType'

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtWsStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
      ignoreExpiration: true,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET
    })
  }

  validate(payload: JwtPayload): JwtPayload {
    console.log(payload)
    return payload
  }

  private static extractJWT(req): string | null {
    const token = req.headers?.Authorization?.split(' ')[1]
    return token
  }
}
