import { User } from '../user.entity'
import { IsNotEmpty, IsString } from 'class-validator'

export class CheckUsernameDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  username: string
}
