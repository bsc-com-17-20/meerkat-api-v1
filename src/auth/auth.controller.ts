import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from './decorators';
import { CreateUserDto } from '../users/dtos';
import { LoginUserDto } from './dtos';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'User login',
    description:
      'This route allows users to log in and obtain an authentication token (JWT).',
    operationId: 'login',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'User logged in successfully: The userID and roleID is returned in a cookie named `token`. You need to include this cookie in subsequent requests. The token is automatically sent with each subsequent request',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized login attemp' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(req.user);
    this.logger.log(loginUserDto);
    const user = this.authService.login(req.user);
    const token = (await user).access_token;
    res.cookie('token', `${token}`, {
      signed: true,
      httpOnly: true,
      // secure: true,
    });
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'User registration',
    description:
      'This route allows users to register and create a new account.  You might get a TimeOut Error this is due to either slow internet cuase it uses an external API to create a profile Img or the hosting platform is slow, but nevertheless the user gets created',
    operationId: 'createUser',
  })
  @ApiResponse({
    status: 201,
    description: 'User registrated successfully',
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
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      delete user.confimationCode;
      delete user.hash;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Someting went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'This route allows users to view their own profile information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
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
        status: { type: 'string' },
        confirmationCode: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  getProfile(@Req() req) {
    try {
      this.logger.log(req.user.id);
      return this.authService.profile(req.user.id);
    } catch (error) {
      throw new InternalServerErrorException('Someting went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
