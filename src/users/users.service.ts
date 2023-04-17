import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { CreateUserParams } from 'src/utils/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  fetchUsers() {}

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({ ...userDetails });
    return this.userRepository.save(newUser);
  }
}
