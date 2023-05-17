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
import { CreateFullUserDto, UpdateUserDto } from './dtos';
import { UsersService } from './users.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidatorPipe } from '../utils/validation.pipe';
import { RolesAuthGuard } from 'src/auth/guards';
import { Public } from 'src/auth/decorators';

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
  @Public() // remember to remove
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
    summary: 'Updates a user with form data',
    description: 'Updates a user with form data',
    operationId: 'updateUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
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

  @Delete(':username')
  @ApiOperation({
    summary: 'Deletes a user',
    description: 'Delete a user',
    operationId: 'deleteUser',
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 400, description: 'Invalid user value' })
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
