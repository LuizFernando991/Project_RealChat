import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExist'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username }
        ]
      }
    })

    if (existUser) throw new UserAlreadyExistsException()

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10)
      }
    })

    return newUser
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async isUsernameAvailable(username: string) {
    const existUser = await this.prisma.user.findUnique({
      where: {
        username
      }
    })

    if (existUser) throw new UserAlreadyExistsException()

    return { messsage: 'username is available.' }
  }

  async updateHashRt(userId: number, refreshToken: string | null) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashRt: refreshToken ? await bcrypt.hash(refreshToken, 10) : null
      }
    })
  }
}
