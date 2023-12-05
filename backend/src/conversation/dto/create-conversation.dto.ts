import { IsNotEmpty, IsInt } from 'class-validator'

export class CreateConversationDto {
  @IsNotEmpty()
  @IsInt()
  friendId: number
}
