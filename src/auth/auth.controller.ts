import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorators/customize';
import { authMessages } from './auth.messages';
import { usersMessages } from '@/modules/users/users.messages';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: authMessages.SUCCESS.LOGIN})
  @ApiResponse({ status: 401, description: authMessages.ERROR.UNAUTHORIZED})
  @ApiBody({ type: LoginDto })
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  
  //@UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({ status: 200, description: usersMessages.SUCCESS.FETCHED })
  @ApiResponse({ status: 401, description: authMessages.ERROR.UNAUTHORIZED})
  getProfile(@Request() req) {
    return req.user;
  }

  //TODO: implement account verification

  //TODO: change password
  
  //TODO: change username
}
