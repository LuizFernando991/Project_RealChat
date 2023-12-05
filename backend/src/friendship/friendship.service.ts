import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Friend } from './friend.entity'

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

  async getFriends(userId: number): Promise<Friend[]> {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [{ senderUserId: userId }, { receiverUserId: userId }]
      },
      select: {
        senderUser: {
          select: {
            id: true,
            bannerImage: true,
            profileImage: true,
            bio: true,
            username: true,
            name: true
          }
        },
        receiverUser: {
          select: {
            id: true,
            bannerImage: true,
            profileImage: true,
            bio: true,
            username: true,
            name: true
          }
        }
      }
    })

    const friends = friendships.map((friendship) =>
      friendship.receiverUser.id === userId
        ? friendship.senderUser
        : friendship.receiverUser
    )

    return friends
  }

  async deleteFriendship(userId: number, friendId: number): Promise<void> {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { AND: [{ senderUserId: userId }, { receiverUserId: friendId }] },
          { AND: [{ senderUserId: friendId }, { receiverUserId: userId }] }
        ]
      }
    })

    if (!friendship) throw new NotFoundException('friend not found.')

    await this.prisma.friendship.delete({
      where: { id: friendship.id }
    })

    //emit socket

    return
  }
}
