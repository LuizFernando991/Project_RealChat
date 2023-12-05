import { IsInt } from 'class-validator'

export class DeleteFriendshipDto {
  @IsInt()
  friendId: number
}
