import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(RolesAuthGuard.name);
  constructor(private readonly role: string) {
    super();
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user || user.role !== this.role) {
      throw err || new UnauthorizedException();
    }
    this.logger.log(user, user.role);
    return user;
  }
}
