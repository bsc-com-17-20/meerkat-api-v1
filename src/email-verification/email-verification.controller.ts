import { Controller, Get, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Public } from 'src/auth/decorators';
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
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @Get(':confimationCode')
  async verifyUser(@Param('confirmationCode') confirmationCode: string) {
    return await this.emailVerificationService.verifyUser(confirmationCode);
  }
}
