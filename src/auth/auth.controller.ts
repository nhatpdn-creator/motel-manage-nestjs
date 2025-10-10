import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorators/customize';
import { authMessages } from './auth.messages';
import { usersMessages } from '@/modules/users/users.messages';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: authMessages.SUCCESS.LOGIN })
  @ApiResponse({ status: 400, description: authMessages.ERROR.UNACTIVATED_STATUS })
  @ApiResponse({ status: 401, description: authMessages.ERROR.UNAUTHORIZED })
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

  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  //TODO: implement account verification
  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
    .sendMail({
      to: 'dskmt17@gmail.com',
      subject: 'Testing Nest MailerModule',
      text: 'Welcome!',
      template: "register.hbs",
      context: {
        name: "pdnn",
        activationCode: 123456
      }
    })
    return "OK";
  }

  //TODO: change password
  
  //TODO: change username
}
