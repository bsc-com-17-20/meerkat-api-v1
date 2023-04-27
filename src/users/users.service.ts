import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as bcrypt from 'bcrypt';
import * as download from 'image-downloader';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchUsers() {
    try {
      const users = await this.userRepository.find();
      let retUsers = [];
      // removing the hash from the return users
      users.forEach((user) => {
        let { hash, ...result } = user;
        retUsers.push(result);
      });
      return retUsers;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }

  async fetchUser(id: number) {
    try {
      const { hash, ...user } = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error retrieving user with id ${id}: ${error.message}`);
    }
  }

  async findOne(username: string) {
    try {
      this.logger.log(username);
      const user = await this.userRepository.findOneBy({ username });
      if (!user) {
        throw new Error(`User with username ${username} not found`);
      }
      this.logger.log(user);
      return user;
    } catch (error) {
      throw new Error(
        `Error retrieving user with username ${username}: ${error.message}`,
      );
    }
  }

  async createUser(userDetails: CreateUserDto) {
    try {
      const options = {
        url: `https://api.dicebear.com/6.x/thumbs/svg?seed=${userDetails.username}`,
        dest: `../../public/avatars/${userDetails.username}.svg`,
      };
      const avatarPath = `/avatars/${userDetails.username}.svg`;
      this.logger.log({ ...userDetails });
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userDetails.password, salt);
      const user = {
        username: userDetails.username,
        email: userDetails.email,
        imageURL: avatarPath,
        hash: hash,
      };
      this.logger.log({ ...user });
      const newUser = this.userRepository.create({ ...user });
      await this.userRepository.save(newUser);
      const result = await download.image(options);
      console.log(result.filename);
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    try {
      await this.fetchUser(id);
      return this.userRepository.update(
        { id },
        { ...updateUserDetails, updatedAt: new Date() },
      );
    } catch (error) {
      throw new Error(`Error updating user with id ${id}: ${error.message}`);
    }
  }

  async deleteuser(id: number) {
    try {
      await this.fetchUser(id);
      return this.userRepository.delete({ id });
    } catch (error) {
      throw new Error(`Error deleting user with id: ${id}: ${error.message}`);
    }
  }
}
