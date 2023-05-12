import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from './decorators';
import { JoiValidatorPipe } from '../utils/validation.pipe';
import { CreateUserDto, createUserSchema } from '../users/dtos';
import { LoginUserDto } from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Logs in and return the authentication cookie',
    description: 'Authenticates a user by providing a JWT access token',
    operationId: 'login',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully authenticated ' + 'The JWT is returned in a cookie',
  })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(req.user);
    this.logger.log(loginUserDto);
    const user = this.authService.login(req.user);
    const token = (await user).access_token;
    res.cookie('token', `${token}`, { signed: true, httpOnly: true });
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Add a new user',
    description: 'Add a new user',
    operationId: 'createUser',
  })
  @ApiResponse({ status: 201, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @UsePipes(new JoiValidatorPipe(createUserSchema))
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Someting went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Get('profile')
  @ApiOperation({
    summary: "View a user's profile",
    description: "Returns a user's details",
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @ApiCookieAuth()
  getProfile(@Request() req) {
    this.logger.log(req.user.id);
    return this.authService.profile(req.user.id);
  }
}
