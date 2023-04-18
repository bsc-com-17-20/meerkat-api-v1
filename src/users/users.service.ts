import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { CreateUserParams } from 'src/utils/types';
import { CreateUserDto, UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  fetchUsers() {
    return this.userRepository.find();
  }

  createUser(userDetails: CreateUserDto) {
    this.logger.log({ ...userDetails });
    const newUser = this.userRepository.create({ ...userDetails });
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
