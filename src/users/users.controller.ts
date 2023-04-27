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
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  createUserSchema,
  updateUserSchema,
} from './dtos';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/auth/decorators';
import { JoiValidatorPipe } from 'src/utils/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiTags('users')
  @ApiOperation({
    summary: 'Finds all users',
    description: 'Get all users',
    operationId: 'fetchUsers',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiCookieAuth()
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
  @ApiOperation({
    summary: 'Find user by ID',
    description: 'Returns a single user',
    operationId: 'fetchUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiCookieAuth()
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

  @Public()
  @Post()
  @ApiTags('users')
  @ApiOperation({
    summary: 'Add a new user',
    description: 'Add a new user',
    operationId: 'createUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @ApiCookieAuth()
  @UsePipes(new JoiValidatorPipe(createUserSchema))
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
  @ApiOperation({
    summary: 'Updates a user with form data',
    description: 'Updates a user with form data',
    operationId: 'updateUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @ApiCookieAuth()
  @UsePipes(new JoiValidatorPipe(updateUserSchema))
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
  @ApiOperation({
    summary: 'Deletes a user',
    description: 'Delete a user',
    operationId: 'deleteUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid user value' })
  @ApiCookieAuth()
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
