import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { Conversation } from './conversation.entity'
import { FormatedConversation } from './formatedConversation.entity'

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  formatConversationData(
    conversation: Conversation,
    userId: number
  ): FormatedConversation {
    const formatedConversation = {
      id: conversation.id,
      contactId:
        conversation.receiverUserId === userId
          ? conversation.senderUserId
          : conversation.receiverUserId,
      contact:
        conversation.receiverUserId === userId
          ? conversation.senderUser
          : conversation.receiverUser,
      lastMessageId: conversation.lastMessageId,
      lastMessage: conversation.lastMessage,
      updatedAt: conversation.updatedAt
    }

    return formatedConversation
  }

  async createOrReturnConversation(
    createConversationDto: CreateConversationDto,
    userId: number
  ): Promise<FormatedConversation> {
    const hasConversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          {
            AND: [
              { senderUserId: userId },
              { receiverUserId: createConversationDto.friendId }
            ]
          },
          {
            AND: [
              { senderUserId: createConversationDto.friendId },
              { receiverUserId: userId }
            ]
          }
        ]
      },
      select: {
        id: true,
        senderUserId: true,
        receiverUserId: true,
        createdAt: true,
        updatedAt: true,
        lastMessageId: true,
        lastMessage: {
          select: {
            content: true,
            createdAt: true
          }
        },
        senderUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        },
        receiverUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        }
      }
    })

    if (hasConversation)
      return this.formatConversationData(hasConversation, userId)

    const newConversation = await this.prisma.conversation.create({
      data: {
        senderUserId: userId,
        receiverUserId: createConversationDto.friendId
      },
      select: {
        id: true,
        senderUserId: true,
        receiverUserId: true,
        createdAt: true,
        updatedAt: true,
        lastMessageId: true,
        lastMessage: {
          select: {
            content: true
          }
        },
        senderUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        },
        receiverUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        }
      }
    })

    return this.formatConversationData(newConversation, userId)
  }

  async getUserConversations(userId: number): Promise<FormatedConversation[]> {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { senderUserId: userId, lastMessageId: { not: null } },
          { receiverUserId: userId, lastMessageId: { not: null } }
        ]
      },
      select: {
        id: true,
        senderUserId: true,
        receiverUserId: true,
        createdAt: true,
        updatedAt: true,
        lastMessageId: true,
        lastMessage: {
          select: {
            content: true
          }
        },
        senderUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        },
        receiverUser: {
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            bannerImage: true
          }
        }
      }
    })

    const formatedConversations = conversations.map((conversation) =>
      this.formatConversationData(conversation, userId)
    )
    return formatedConversations
  }
}
