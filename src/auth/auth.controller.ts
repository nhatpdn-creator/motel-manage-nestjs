import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorators/customize';
import { authMessages } from './auth.messages';
import { usersMessages } from '@/modules/users/users.messages';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UsersService } from '@/modules/users/users.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: authMessages.SUCCESS.LOGIN})
  @ApiResponse({ status: 401, description: authMessages.ERROR.UNAUTHORIZED})
  @ApiBody({ type: LoginDto })
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @HttpCode(201)
  @Public()
  @ApiResponse({ status: 201, description: usersMessages.SUCCESS.CREATED })
  @ApiResponse({ status: 400, description: usersMessages.ERROR.ALREADY_EXISTS })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
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
