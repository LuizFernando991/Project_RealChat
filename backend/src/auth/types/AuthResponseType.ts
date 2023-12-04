import { User } from 'src/user/user.entity'

export type AuthResponse = {
  user: Omit<User, 'password | hashRt'>
  access_token: string
  refresh_token: string
}
