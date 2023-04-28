import { Module } from '@nestjs/common';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/models/users.entity';
import { Reply } from './models/replies.entity';
import { Post } from '../posts/models/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}
