import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  fetchUsers() {
    return this.userRepository.find();
  }

  fetchUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async findOne(username: string) {
    this.logger.log(username);
    const peek = await this.userRepository.findOneBy({ username });
    this.logger.log(peek + 'hey');
    return this.userRepository.findOneBy({ username });
  }

  async createUser(userDetails: CreateUserDto) {
    this.logger.log({ ...userDetails });
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userDetails.password, salt);
    const user = {
      username: userDetails.username,
      email: userDetails.email,
      hash: hash,
    };
    this.logger.log({ ...user });
    const newUser = this.userRepository.create({ ...user });
    return this.userRepository.save(newUser);
  }

  updateUser(id: number, updateUserDetails: UpdateUserDto) {
    return this.userRepository.update(
      { id },
      { ...updateUserDetails, updatedAt: new Date() },
    );
  }

  deleteuser(id: number) {
    return this.userRepository.delete({ id });
  }
}
