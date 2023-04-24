import {
  Controller,
  Get,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @ApiTags('auth')
  @ApiOperation({
    description: 'Authenticates a user by providing a JWT access token',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    this.logger.log(req.user);
    const user = this.authService.login(req.user);
    const token = (await user).access_token;
    res.cookie('token', `${token}`, { signed: true });
    return this.authService.login(req.user);
  }

  @ApiTags('auth')
  @ApiOperation({ description: "Returns a user's details" })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
