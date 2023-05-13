import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
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
import { JoiValidatorPipe } from '../utils/validation.pipe';
import { RolesAuthGuard } from 'src/auth/guards';

@ApiTags('users')
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Get()
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

  // @Get(':id')
  // @ApiOperation({
  //   summary: 'Find user by ID',
  //   description: 'Returns a single user',
  //   operationId: 'fetchUser',
  // })
  // @ApiResponse({ status: 200, description: 'Successful operation' })
  // @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  // @ApiResponse({ status: 400, description: 'Invalid status value' })
  // @ApiCookieAuth()
  // async getUser(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     return await this.usersService.fetchUser(id);
  //   } catch (error) {
  //     throw new NotFoundException(`Something went wrong`, {
  //       cause: error,
  //       description: `${error.message}`,
  //     });
  //   }
  // }

  @Get(':user')
  @ApiOperation({
    summary: 'Find user using their username',
    description: 'Returns a single user',
    operationId: 'findOne',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiCookieAuth()
  async getUserByUsername(@Param('user') username: string) {
    try {
      const { hash, ...result } = await this.usersService.findOne(username);
      return result;
    } catch (error) {
      throw new NotFoundException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  // @UseGuards(new RolesAuthGuard('admin'))
  @Post()
  @ApiOperation({
    summary: 'Admin: Add a new user',
    description:
      'Add a new user, user privaledged user creation is via /auth/register route.',
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

  @Patch()
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
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      let { id } = req.user;
      this.logger.log(id);
      return await this.usersService.updateUser(req.user.id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Delete()
  @ApiOperation({
    summary: 'Deletes a user',
    description: 'Delete a user',
    operationId: 'deleteUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid user value' })
  @ApiCookieAuth()
  async deleteUser(@Request() req) {
    try {
      return await this.usersService.deleteuser(req.user.id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
