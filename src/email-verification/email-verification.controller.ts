import { Controller, Get, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Public } from 'src/auth/decorators';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Get(':confimationCode')
  async verifyUser(@Param('confirmationCode') confirmationCode: string) {
    return await this.emailVerificationService.verifyUser(confirmationCode);
  }
}
