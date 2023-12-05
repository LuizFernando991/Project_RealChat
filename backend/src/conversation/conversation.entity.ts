import {
  Message as PrismaMessage,
  Conversation as PrismaConversation
} from '@prisma/client'
import { User } from 'src/user/user.entity'

export class Conversation implements PrismaConversation {
  id: number
  senderUserId: number
  receiverUserId: number
  createdAt: Date
  updatedAt: Date
  lastMessageId: number
  receiverUser: Omit<User, 'password' | 'email' | 'createdAt' | 'updatedAt'>
  senderUser: Omit<User, 'password' | 'email' | 'createdAt' | 'updatedAt'>
  lastMessage: Pick<PrismaMessage, 'content'>
}
