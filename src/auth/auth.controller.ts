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
  UsePipes,
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
import { JoiValidatorPipe } from '../utils/validation.pipe';
import { CreateUserDto, createUserSchema } from '../users/dtos';
import { LoginUserDto, loginUserSchema } from './dtos';

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
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized login attemp' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  // @UsePipes(new JoiValidatorPipe(loginUserSchema))
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
      'This route allows users to register and create a new account.',
    operationId: 'createUser',
  })
  @ApiResponse({ status: 201, description: 'User registrated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 405, description: 'Internal server error' })
  // @UsePipes(new JoiValidatorPipe(createUserSchema))
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
