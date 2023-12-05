import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { JwtPayload } from './types/JwtPayloadType'
import { Tokens } from './types/TokensType'
import { AuthResponse } from './types/AuthResponseType'
import * as argon from 'argon2'
import { JwtPayloadWithRefreshToken } from './types/JwtPayloadWithRefreshType'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const user = await this.userService.create(createUserDto)

    const tokens = await this.createTokens(user.id, user.email)

    delete user.password

    return {
      user,
      ...tokens
    }
  }

  async login(user: User): Promise<AuthResponse> {
    const tokens = await this.createTokens(user.id, user.email)

    delete user.password

    return {
      user,
      ...tokens
    }
  }

  async refreshToken(data: JwtPayloadWithRefreshToken) {
    const user = await this.userService.getUserByEmail(data.email)
    const hashs = await this.userService.getHashRt(data.sub)

    let hasMatch: boolean

    for await (const h of hashs) {
      const match = await argon.verify(h.hashRt, data.refreshToken)
      if (match) hasMatch = true
    }

    if (!user || !hasMatch) throw new UnauthorizedException('invalid token')

    return await this.createAccessToken(data.sub, user.email)
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email)
    if (!user || !(await argon.verify(user.password, password)))
      throw new UnauthorizedException('email or password is incorrect')

    return user
  }

  async createTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '5m'
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d'
      })
    ])

    await this.userService.clearAllExpiredHashRt(userId)
    await this.userService.createHashRt(userId, refreshToken)

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  async createAccessToken(
    userId: number,
    email: string
  ): Promise<Omit<Tokens, 'refresh_token'>> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email
    }

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '5min'
    })

    return {
      access_token: accessToken
    }
  }

  async logOutOfAllSessions(user: JwtPayloadWithRefreshToken) {
    await this.userService.clearAllHashRt(user.sub)
    return
  }

  async logout(user: JwtPayloadWithRefreshToken): Promise<boolean> {
    const hashs = await this.userService.getHashRt(user.sub)

    for await (const hash of hashs) {
      const remove = await argon.verify(hash.hashRt, user.refreshToken)
      if (remove) {
        this.userService.deleteHashRt(hash.id)
      }
    }

    return
  }
}
