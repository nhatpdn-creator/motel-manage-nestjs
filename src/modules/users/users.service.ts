import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { usersMessages } from "./users.messages";
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from "./dto/update-user.dto";
import { hashedPasswordHelper } from "@/helpers/utils";
import { CreateAuthDto } from "@/auth/dto/create-auth.dto";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class UsersService {
    private readonly saltRounds = 10;

    constructor(
        private readonly prisma:PrismaService,
        private readonly mailerService: MailerService
    ) {}

    async getAll(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize

        const [users, total] = await this.prisma.$transaction([
            this.prisma.users.findMany({
                skip,
                take: pageSize,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    is_active: true,
                },
            }),
            this.prisma.users.count(), // total number of users
        ]);
        return { 
            data: users,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            },
        };
    }

    async findOne(id: string) {
        // Validate id
        const user = await this.prisma.users.findUnique({ 
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                is_active: true,
            } ,
        });

        return user;
    }

    async findByEmail(email: string) {
        return await this.prisma.users.findUnique({ where: {email} });
    }

    // admin create
    async create(registerData: CreateUserDto) {
        const {name, email, password} = registerData;

        // Check existing email in database
        await this.checkExistingEmail(email);

        const hashedPassword = await hashedPasswordHelper(password, this.saltRounds);
        
        await this.prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        
        return { message: usersMessages.SUCCESS.CREATED}
    }

    async update(updateUserDto: UpdateUserDto) {
        // check user id validation
        await this.checkExistingUserId(updateUserDto.id);
        
        return this.prisma.users.update({
            where: { id: updateUserDto.id },
            data: { name: updateUserDto.name },
        });
    }

    async remove(id: string) {
        await this.checkExistingUserId(id);

        await this.prisma.users.delete({ where: { id } });

        return { message: usersMessages.SUCCESS.DELETED };
    }

    // user create
    async handleRegister(registerDto: CreateAuthDto) {
        const {name, email, password} = registerDto;

        // Check existing email in database
        await this.checkExistingEmail(email);

        const hashedPassword = await hashedPasswordHelper(password, this.saltRounds);
        const code_id_uuid = uuidv4();
        const user = await this.prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                is_active: false,
                code_id: code_id_uuid,
                code_expired: dayjs().add(5, 'minutes').toDate()
                //code_expired: dayjs().add(30, 'seconds').toDate(),
            }
        });
        // send a verification email
        this.mailerService.sendMail({
            to: user.email,
            subject: 'Activate your account for motel management application',
            template: "register.hbs",
            context: {
            name: user.name,
            activationCode: code_id_uuid            
                }
        })

        return {
            id: user.id
        };

        // TODO: send email verification     
    }

    /**
     * Check if an email already exists in database
     * Throws ConflictException if found
     */
    private async checkExistingEmail(email: string): Promise<void> {
        const existingEmail = await this.prisma.users.findUnique({ where: { email } });

        if (existingEmail) {
            throw new BadRequestException(usersMessages.ERROR.ALREADY_EXISTS);
        }
    }

    /**
     * Helper function to check if user id exists
     * Throw NotFoundException if not found
     */
    private async checkExistingUserId(id: string): Promise<void> {
        const user = await this.prisma.users.findUnique({ where: { id } });
        if (!user) {
            throw new NotFoundException(usersMessages.ERROR.NOT_FOUND);
        }
    }

}
