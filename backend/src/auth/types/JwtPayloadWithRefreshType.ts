import { JwtPayload } from './JwtPayloadType'

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken?: string }
