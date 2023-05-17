import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, EmailVerificationService],
  exports: [UsersService],
})
export class UsersModule {}
