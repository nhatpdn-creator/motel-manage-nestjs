import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { authMessages } from '../auth.messages';
import { usersMessages } from '@/modules/users/users.messages';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email'});
  }

  async validate(email: string, password: string): Promise<any> {
    
    const user = await this.authService.validateUser(email, password );
    if (!user) {
      throw new UnauthorizedException(usersMessages.ERROR.NOT_FOUND);
    }

    if(user.is_active === false) {
      throw new BadRequestException(authMessages.ERROR.UNACTIVATED_STATUS);
    }
    return user;
  }
}
