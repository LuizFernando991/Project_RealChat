import {
  Controller,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body
} from '@nestjs/common'
import { JwtPayload } from 'src/auth/types/JwtPayloadType'
import { CurrentUser } from 'src/decorators/currentUser.decorator'
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard'
import { FriendshipService } from './friendship.service'
import { DeleteFriendshipDto } from './dto/deletefriendship.dto'

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getFriends(@CurrentUser() user: JwtPayload) {
    return this.friendshipService.getFriends(user.sub)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteFriendship(
    @CurrentUser() user: JwtPayload,
    @Body() deleteFriendshipDto: DeleteFriendshipDto
  ) {
    return this.friendshipService.deleteFriendship(
      user.sub,
      deleteFriendshipDto.friendId
    )
  }
}
