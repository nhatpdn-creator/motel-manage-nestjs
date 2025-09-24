import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    imports: [PrismaModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
})

export class UsersModule {}