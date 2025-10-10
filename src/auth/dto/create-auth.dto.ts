import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({ description: 'Username' })
    @IsNotEmpty({ message: 'Name must not be empty' })
    name: string;

    @ApiProperty({ description: 'Email address of user' })
    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ description: 'Password of the account (min. 6 chars)' })
    @IsNotEmpty({ message:'Password must not be empty' })
    @MinLength(6)
    password: string;
}