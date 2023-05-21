import { Controller, Get, Param, Req } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Public } from '../auth/decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email-verification')
@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @ApiOperation({
    summary: "Link sent to a user's email that activates a user's account",
    description:
      'link that upon clicking will send a get request with a confirmationCode param that sets a user account to active',
    operationId: 'verifyUser',
  })
  @ApiResponse({ status: 200, description: 'Confirmation success' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get(':confimationCode')
  async verifyUser(@Param('confirmationCode') confirmationCode: string) {
    return await this.emailVerificationService.verifyUser(confirmationCode);
  }

  @Get()
  async testUser(@Req() req) {
    return await this.emailVerificationService.sendConfirmationEmail(
      req.user.id,
    );
  }
}
