import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { JwtPayload } from './types/JwtPayloadType'
import { Tokens } from './types/TokensType'
import { AuthResponse } from './types/AuthResponseType'
import * as bcrypt from 'bcrypt'
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
    delete user.hashRt

    return {
      user,
      ...tokens
    }
  }

  async login(user: User): Promise<AuthResponse> {
    const tokens = await this.createTokens(user.id, user.email)

    delete user.password
    delete user.hashRt

    return {
      user,
      ...tokens
    }
  }

  async refreshToken(data: JwtPayloadWithRefreshToken) {
    const user = await this.userService.getUserByEmail(data.email)

    if (
      !user ||
      !user.hashRt ||
      !(await bcrypt.compare(data.refreshToken, user.hashRt))
    )
      throw new UnauthorizedException('invalid token')

    return await this.createAccessToken(user.id, user.email)
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password)))
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
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d'
      })
    ])

    await this.userService.updateHashRt(userId, refreshToken)

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
      expiresIn: '15m'
    })

    return {
      access_token: accessToken
    }
  }

  async logout(userId: number): Promise<boolean> {
    await this.userService.updateHashRt(userId, null)

    return true
  }
}
