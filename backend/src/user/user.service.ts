import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserAlreadyExistsException } from 'src/exceptions/userAlreadyExist'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const existUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }]
      }
    })

    if (existUser) throw new UserAlreadyExistsException()
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
}
