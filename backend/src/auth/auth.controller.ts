import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { CurrentUser } from 'src/decorators/currentUser.decorator'
import { JwtPayloadWithRefreshToken } from './types/JwtPayloadWithRefreshType'
import { JwtPayload } from './types/JwtPayloadType'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('refreshToken')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUser() user: JwtPayloadWithRefreshToken) {
    return this.authService.refreshToken(user)
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: JwtPayload): Promise<boolean> {
    return this.authService.logout(user.sub)
  }
}
