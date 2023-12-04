import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common'
import { CheckUsernameDto } from './dto/check-username.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('checkusername')
  @HttpCode(HttpStatus.OK)
  checkUsername(@Body() data: CheckUsernameDto) {
    return this.userService.isUsernameAvailable(data.username)
  }
}
