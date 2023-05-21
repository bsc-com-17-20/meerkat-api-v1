import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../users/models/users.entity';
import { Status } from '../users/models/status.enum';

@Injectable()
export class EmailVerificationService {
  logger = new Logger(EmailVerificationService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async sendConfirmationEmail(id: number) {
    const user: User = await this.userRepository.findOneBy({ id });
    const { username, email, confimationCode, status } = user;
    if (status === Status.ACTIVE) {
      return { msg: 'user is already active' };
    }
    return this.mailService.sendMail({
      from: process.env.USER,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
            <h2>Hello ${username}</h2>
            <div>
            <p>Thank you for creating an account. Please confirm your email by clicking the following link</p>
            <a href=http://localhost:3000/email-verification/${confimationCode}> Click here</a>
            </div>
            `,
    });
  }

  async verifyUser(confimationCode: string) {
    try {
      const user = await this.userRepository.findOneBy({ confimationCode });
      this.logger.log({ ...user });
      if (!user) {
        throw new Error(`User with code ${confimationCode} not found`);
      }
      // user.status = Status.ACTIVE;
      this.logger.log({ ...user });
      await this.userRepository.update(
        { id: user.id },
        { status: Status.ACTIVE },
      );
      return this.userRepository.findOneBy({ confimationCode });
    } catch (error) {
      throw new Error(
        `Error retrieving user with code ${confimationCode}: ${error.message}`,
      );
    }
  }
}
