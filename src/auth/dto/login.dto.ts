import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

export class LoginDto {
    @ApiProperty({ description: 'User email address'})
    @IsNotEmpty({ message: "Email must not be empty" })
    email: string;

    @ApiProperty({ description: 'User password'})
    @IsNotEmpty({ message: "Password must not be empty "})
    @MinLength(6)
    password: string;
}