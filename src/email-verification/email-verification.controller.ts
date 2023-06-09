import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Public } from '../auth/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email-verification')
@Controller('/users/email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('send')
  @ApiOperation({
    summary: 'Send email verification link',
    description:
      "This route sends a verification link to the user's email account for email verification.",
    operationId: 'sendConfirmationEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verification link sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async sendConfirmationEmail(@Req() req) {
    try {
      return await this.emailVerificationService.sendConfirmationEmail(
        req.user.id,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Public()
  @ApiOperation({
    summary: 'Verify email with confirmation code',
    description:
      "This route is triggered when the user clicks on the verification link sent to their email account. It changes the user's status from pending to active.",
    operationId: 'verifyUser',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
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
        confirmationCode: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid confirmation code',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get('verify/:confimationCode')
  async verifyUser(@Param('confirmationCode') confirmationCode: string) {
    try {
      const user = await this.emailVerificationService.verifyUser(
        confirmationCode,
      );
      delete user.hash;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
