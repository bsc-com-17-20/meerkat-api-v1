import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/models/users.entity';
import { Status } from 'src/users/models/status.enum';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async sendEmail(username: string, email: string, confimationCode: string) {
    return this.mailService.sendMail({
      from: 'meerkatforum@gmail.com',
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
      const user = await this.userRepository.findOne({
        where: { confimationCode },
      });
      if (!user) {
        throw new Error(`User with code ${confimationCode} not found`);
      }
      user.status = Status.ACTIVE;
      return this.userRepository.update({ confimationCode }, { ...user });
    } catch (error) {
      throw new Error(
        `Error retrieving user with code ${confimationCode}: ${error.message}`,
      );
    }
  }
}
