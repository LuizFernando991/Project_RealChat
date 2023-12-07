import { Body, Controller, UseGuards, Post, Get } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard'
import { CreateConversationDto } from './dto/create-conversation.dto'
import { ConversationService } from './conversation.service'
import { CurrentUser } from 'src/decorators/currentUser.decorator'
import { JwtPayload } from 'src/auth/types/JwtPayloadType'

@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly eventEmmiter: EventEmitter2
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrGetConversation(
    @Body() createConversationDto: CreateConversationDto,
    @CurrentUser() user: JwtPayload
  ) {
    const conversation =
      await this.conversationService.createOrReturnConversation(
        createConversationDto,
        user.sub
      )
    this.eventEmmiter.emit('conversation-create', { conversation })
    return conversation
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserConversations(@CurrentUser() user: JwtPayload) {
    return this.conversationService.getUserConversations(user.sub)
  }
}
