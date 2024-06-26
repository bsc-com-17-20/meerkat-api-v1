import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, ResponseUserDto } from '../users/dtos';
import { RequestUserDto } from './dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ResponseUserDto> {
    const user = await this.usersService.findOne(username);
    this.logger.log({ ...user });
    const isMatch = bcrypt.compareSync(password, user.hash);
    if (user && isMatch) {
      const { hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: RequestUserDto) {
    const payload = { username: user.username, role: user.role, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDetails: CreateUserDto) {
    return this.usersService.createUser(userDetails);
  }

  async profile(id: number) {
    return this.usersService.fetchUser(id);
  }
}
