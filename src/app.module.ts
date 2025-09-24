import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

@Module({
  imports: [
            PrismaModule,
            UsersModule,
            AuthModule,
            ConfigModule.forRoot({
              isGlobal: true,
            }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
