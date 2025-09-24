import { Body, Param, Post, Patch, Get, Controller, HttpCode, HttpStatus, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiQuery, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { usersMessages } from './users.messages';
import { UpdateUserDto } from './dto/update-user.dto';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    @Get()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: usersMessages.SUCCESS.FETCHED })
    @ApiResponse({ status: 500, description: "Internal server error" })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 20})
    getAllUsers(
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = pageSize ? parseInt(pageSize, 10) : 10;

        return this.usersService.getAll(pageNumber, limitNumber);
    }

    /**
    @Get(':id')
    @HttpCode(200)
    @ApiParam({ name: 'id', type: String, description: 'User ID'})
    async getUserById(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }
    */
   
    @Post()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: usersMessages.SUCCESS.CREATED })
    @ApiResponse({ status: 400, description: usersMessages.ERROR.ALREADY_EXISTS })
    @ApiResponse({ status: 500, description: "Internal server error" })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: usersMessages.SUCCESS.UPDATED })
    @ApiResponse({ status: 400, description: usersMessages.ERROR.PROVIDE_ID })
    @ApiResponse({ status: 404, description: usersMessages.ERROR.NOT_FOUND })
    @ApiBody({ type: UpdateUserDto})
    async update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto)
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiResponse({ status: 200, description: usersMessages.SUCCESS.DELETED })
    @ApiResponse({ status: 400, description: usersMessages.ERROR.PROVIDE_ID })
    @ApiResponse({ status: 404, description: usersMessages.ERROR.NOT_FOUND })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    async delete(@Param('id') id: string) {
        this.usersService.remove(id);
    }
}