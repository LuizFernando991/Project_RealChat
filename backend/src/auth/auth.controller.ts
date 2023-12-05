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
import { LocalAuthGuard } from 'src/guards/localAuthGuard'
import { RefreshAuthGuard } from 'src/guards/refreshAuthGuard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
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
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUser() user: JwtPayloadWithRefreshToken) {
    return this.authService.refreshToken(user)
  }

  @Post('logout')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: JwtPayloadWithRefreshToken): Promise<void> {
    this.authService.logout(user)
    return
  }

  @Post('logoutofallsessions')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  logoutOfAllSessions(
    @CurrentUser() user: JwtPayloadWithRefreshToken
  ): Promise<void> {
    this.authService.logOutOfAllSessions(user)
    return
  }
}
