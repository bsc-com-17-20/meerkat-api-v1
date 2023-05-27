import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateFullUserDto, ResponseUserDto, UpdateUserDto } from './dtos';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidatorPipe } from '../utils/validation.pipe';
import { RolesAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';
import { User } from './models/users.entity';

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
  @ApiResponse({ status: 200, description: 'Users found' })
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

  @Get(':user')
  @ApiOperation({
    summary: 'Get a user by username',
    description:
      'This route retrieves the user information for a specific user identified by their userId.',
    operationId: 'findOne',
  })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  async getUserByUsername(@Param('user') username: string) {
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
    summary: 'Admin: Create a new user and generate an avatar',
    description:
      'This route allows creating a new user by providing the necessary details. ' +
      'Upon successful creation, an avatar for the user is generated using the DiceBears API.' +
      'The user creation route, however, is limited to admin privileges.' +
      'Regular users can utilize the "auth/register" route to create their accounts. ',
    operationId: 'createUser',
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UsePipes(new ValidationPipe())
  // @UsePipes(new JoiValidatorPipe(createUserSchema))
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

  @Patch()
  @ApiOperation({
    summary: 'Update user infromation',
    description:
      'This route allows updating the information of a specific user identified by their userId.' +
      'Since a user requires to be logged in to update their userId is taken from their jwt stored in the cookie jar',
    operationId: 'updateUser',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UsePipes(new ValidationPipe())
  // @UsePipes(new JoiValidatorPipe(updateUserSchema))
  async updateUser(@Req() req, @Body() updateUserDto: UpdateUserDto) {
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
    summary: 'Delete user',
    description:
      'This route allows deleting a specific user identified by their userId.' +
      'Since a user requires to be logged in to update their userId is taken from their jwt stored in the cookie jar',
    operationId: 'deleteUser',
  })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  async deleteUser(@Req() req) {
    try {
      return await this.usersService.deleteuser(req.user.username);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
