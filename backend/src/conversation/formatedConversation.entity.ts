import { Message as PrismaMessage } from '@prisma/client'
import { User } from 'src/user/user.entity'

export class FormatedConversation {
  id: number
  contactId: number
  contact: Omit<User, 'password' | 'email' | 'createdAt' | 'updatedAt'>
  updatedAt: Date
  lastMessageId: number
  lastMessage: Pick<PrismaMessage, 'content'>
}
