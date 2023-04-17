import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser(createUserDto);
  }
}
