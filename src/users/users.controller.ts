import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateFullUserDto, ResponseUserDto, UpdateUserDto } from './dtos';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators';
import { DeleteResult } from 'typeorm';

@ApiExtraModels(ResponseUserDto)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This route retrieves the information if all users.',
    operationId: 'fetchUsers',
  })
  @ApiResponse({
    status: 200,
    description: 'Users found',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'number' },
          role: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
          imageURL: { type: 'string' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          posts: { type: 'array' },
          replies: { type: 'array' },
          status: { type: 'string' },
          confimationCode: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  async getUsers(): Promise<ResponseUserDto[]> {
    try {
      return await this.usersService.fetchUsers();
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Get(':username')
  @ApiOperation({
    summary: 'Get a user by username',
    description:
      'This route retrieves the user information for a specific user identified by their userId.',
    operationId: 'findOne',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        role: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        imageURL: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        posts: { type: 'array' },
        replies: { type: 'array' },
        status: { type: 'string' },
        confimationCode: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUserDto> {
    try {
      const { hash, ...result } = await this.usersService.findOne(username);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  // @UseGuards(new RolesAuthGuard('admin'))
  @Public() // remember to remove
  @Post()
  @ApiOperation({
    summary: 'Create a new user and generate an avatar',
    description:
      'This route allows creating a new user by providing the necessary details. ' +
      'Upon successful creation, an avatar for the user is generated using the DiceBears API.' +
      'The user creation route, however, is limited to admin privileges.' +
      'Regular users can utilize the "auth/register" route to create their accounts. ' +
      'You might get a TimeOut Error this is due to either slow internet cuase it uses an external API to create a profile Img or the hosting platform is slow, but nevertheless the user gets created',
    operationId: 'createUser',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        role: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        imageURL: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        posts: { type: 'array' },
        replies: { type: 'array' },
        status: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UsePipes(new ValidationPipe())
  async createFullUser(@Body() createFullUserDto: CreateFullUserDto) {
    try {
      const user = await this.usersService.createFullUser(createFullUserDto);
      delete user.hash;
      delete user.confimationCode;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Someting went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':username')
  @ApiOperation({
    summary: 'Update user infromation',
    description:
      'This route allows updating the information of a specific user identified by their userId.' +
      'Since a user requires to be logged in to update their userId is taken from their jwt stored in the cookie jar',
    operationId: 'updateUser',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        raw: { type: 'array', items: { type: 'string' } },
        affected: { type: 'number' },
        generatedMaps: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
    @Param('username') username: string,
  ) {
    try {
      this.logger.log(updateUserDto);
      return await this.usersService.updateUser(
        req.user.role,
        updateUserDto,
        username,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Delete(':username')
  @ApiOperation({
    summary: 'Delete user',
    description:
      'This route allows deleting a specific user identified by their username.' +
      'Since a user requires to be logged in to update their userId is taken from their jwt stored in the cookie jar',
    operationId: 'deleteUser',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        raw: { type: 'array', items: { type: 'string' } },
        affected: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  async deleteUser(
    @Req() req,
    @Param('username') username: string,
  ): Promise<DeleteResult> {
    try {
      return await this.usersService.deleteuser(req.user.role, username);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
