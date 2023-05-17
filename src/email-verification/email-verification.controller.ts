import { Controller, Param, Post } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post(':confimationCode')
  async verifyUser(@Param('confirmationCode') confirmationCode: string) {
    return await this.emailVerificationService.verifyUser(confirmationCode);
  }
}
