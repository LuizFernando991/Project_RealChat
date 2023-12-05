import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserAlreadyExistsException } from '../exceptions/userAlreadyExist'
import * as argon from 'argon2'

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
        password: await argon.hash(createUserDto.password)
      }
    })

    return newUser
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
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

  async createHashRt(
    userId: number,
    refreshToken: string | null
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId,
        hashRt: await argon.hash(refreshToken)
      }
    })
  }

  async getHashRt(userId: number) {
    return await this.prisma.refreshToken.findMany({
      where: { userId }
    })
  }

  async deleteHashRt(id: number) {
    return await this.prisma.refreshToken.delete({
      where: { id }
    })
  }

  async clearAllExpiredHashRt(userId: number) {
    const createdDateLimit = new Date()
    createdDateLimit.setDate(createdDateLimit.getDate() - 7)

    const hashs = await this.prisma.refreshToken.findMany({
      where: {
        userId
      },
      orderBy: { createdAt: 'asc' }
    })

    const Allhashs = hashs.reduce(
      (acc, item) => {
        if (item.createdAt < createdDateLimit) {
          acc.expired.push(item)
        } else {
          acc.valids.push(item)
        }
        return acc
      },
      { expired: [], valids: [] }
    )

    if (Allhashs.expired.length > 0) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          id: { in: Allhashs.expired.map((expired) => expired.id) }
        }
      })
    }

    if (Allhashs.valids.length >= 3) {
      await this.prisma.refreshToken.delete({
        where: { id: hashs[0].id }
      })
    }
  }

  async clearAllHashRt(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId
      }
    })
  }
}
