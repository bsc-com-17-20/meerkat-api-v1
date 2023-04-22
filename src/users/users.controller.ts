import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
    return await this.usersService.fetchUsers();
  }

  @Get(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Get a single user using an id' })
  async getUser(@Param('id', ParseIntPipe) id: number) {
    this.usersService.fetchUser(id);
  }

  @Post()
  @ApiTags('users')
  @ApiOperation({ description: 'Create a user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Update a user match an id' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiTags('users')
  @ApiOperation({ description: 'Delete a user using an id' })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteuser(id);
  }
}
