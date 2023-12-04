import { User as PrismaUser } from '@prisma/client'

export class User implements PrismaUser {
  id: number
  email: string
  username: string
  password: string
  name: string
  bio: string
  profileImage: string
  bannerImage: string
  createdAt: Date
  updatedAt: Date
}
