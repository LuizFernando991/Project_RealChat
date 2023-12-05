import { Body, Controller, UseGuards, Post, Get } from '@nestjs/common'
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { ConversationService } from './conversation.service'
import { CurrentUser } from 'src/decorators/currentUser.decorator'
import { JwtPayload } from 'src/auth/types/JwtPayloadType'

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  createOrGetConversation(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser() user: JwtPayload
  ) {
    return this.conversationService.createOrReturnConversation(
      createConversationDto,
      user.sub
    )
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserConversations(@CurrentUser() user: JwtPayload) {
    return this.conversationService.getUserConversations(user.sub)
  }
}
