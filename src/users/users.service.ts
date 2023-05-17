import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import {
  CreateFullUserDto,
  CreateUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from './dtos';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as download from 'image-downloader';
import { Role } from './models/role.enum';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async fetchUsers(): Promise<ResponseUserDto[]> {
    try {
      const users = await this.userRepository.find();
      let retUsers: ResponseUserDto[] = [];
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

  async fetchUser(id: number): Promise<ResponseUserDto> {
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

  async findOne(username: string): Promise<User> {
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

  async createUser(userDetails: CreateUserDto): Promise<User> {
    try {
      const options = {
        url: `https://api.dicebear.com/6.x/thumbs/svg?seed=${userDetails.username}`,
        dest: `../../public/avatars/${userDetails.username}.svg`,
      };
      const avatarPath = `/avatars/${userDetails.username}.svg`;
      this.logger.log({ ...userDetails });
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userDetails.password, salt);
      const confimationCode = jwt.sign(
        { email: userDetails.email },
        process.env.JWT_SECRET,
      );
      const user = {
        username: userDetails.username,
        email: userDetails.email,
        imageURL: avatarPath,
        hash: hash,
        confimationCode: confimationCode,
      };
      this.logger.log({ ...user });
      const newUser = this.userRepository.create({ ...user });
      const savedUser = this.userRepository.save(newUser);
      await download.image(options);
      this.emailVerificationService.sendEmail(
        userDetails.username,
        userDetails.email,
        confimationCode,
      );
      return savedUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async createFullUser(userDetails: CreateFullUserDto): Promise<User> {
    try {
      const options = {
        url: `https://api.dicebear.com/6.x/thumbs/svg?seed=${userDetails.username}`,
        dest: `../../public/avatars/${userDetails.username}.svg`,
      };
      const avatarPath = `/avatars/${userDetails.username}.svg`;
      this.logger.log({ ...userDetails });
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userDetails.password, salt);
      const confimationCode = jwt.sign(
        { email: userDetails.email },
        process.env.JWT_SECRET,
      );
      let role: Role;
      if (userDetails.role === 'admin') {
        role = Role.ADMIN;
      } else if (userDetails.role === 'user') {
        role = Role.USER;
      } else {
        throw Error('role type is invalid');
      }
      const user = {
        username: userDetails.username,
        email: userDetails.email,
        role,
        imageURL: avatarPath,
        hash: hash,
        confimationCode: confimationCode,
      };
      this.logger.log({ ...user });
      const newUser = this.userRepository.create({ ...user });
      const savedUser = this.userRepository.save(newUser);
      await download.image(options);
      await this.emailVerificationService.sendEmail(
        userDetails.username,
        userDetails.email,
        confimationCode,
      );
      return savedUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async updateUser(
    id: number,
    updateUserDetails: UpdateUserDto,
  ): Promise<UpdateResult> {
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

  async deleteuser(username: string): Promise<DeleteResult> {
    try {
      await this.findOne(username);
      return this.userRepository.delete({ username });
    } catch (error) {
      throw new Error(
        `Error deleting user with id: ${username}: ${error.message}`,
      );
    }
  }
}
