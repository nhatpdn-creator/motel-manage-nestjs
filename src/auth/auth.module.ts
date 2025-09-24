import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    UsersModule,    
        JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      }),
    }),
    PassportModule,
  ],

  providers: [
      AuthService, 
      LocalStrategy,
      JwtStrategy,
  ],
  
  controllers: [
      AuthController,
  ]
})
export class AuthModule {}
