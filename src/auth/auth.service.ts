import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "@/modules/users/users.service";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { comparePasswordHelper } from "@/helpers/utils";
import { usersMessages } from "@/modules/users/users.messages";
import { JwtService } from "@nestjs/jwt";
import { authMessages } from "./auth.messages";
import { CreateAuthDto } from "./dto/create-auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService ,   
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException(authMessages.ERROR.INVALID_EMAIL_FORMAT);
    }  
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    
    if(!user || !isValidPassword) {
      return null;
    }
    return user;

  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email};
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  handleRegister = async(registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  }
  
  //TODO: Send activation code to activate a new account

}