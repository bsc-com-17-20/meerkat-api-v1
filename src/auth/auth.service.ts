import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    this.logger.log({ ...user });
    if (user && user.hash === pass) {
      const { hash, ...result } = user;
      return result;
    }
    return null;
  }
}
