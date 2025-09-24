import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        description: 'User id'
    })
    @IsNotEmpty({ message: 'Please provide id' })
    id: string;

    @ApiProperty({
        description: 'Update a new name'
    })
    @IsOptional() 
    name: string;
}