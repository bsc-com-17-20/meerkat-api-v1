import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiTags('users')
  @ApiOperation({ description: 'Get all users' })
  async getUsers() {
    try {
      return await this.usersService.fetchUsers();
    } catch (error) {
      throw new NotFoundException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Get(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Get a single user using an id' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.fetchUser(id);
    } catch (error) {
      throw new NotFoundException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Post()
  @ApiTags('users')
  @ApiOperation({ description: 'Create a user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Someting went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Update a user match an id' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Delete(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Delete a user using an id' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.deleteuser(id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
