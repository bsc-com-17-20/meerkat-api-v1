import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { BoardsService } from '../boards/boards.service';
import { Board } from '../boards/model/boards.entity';
import { User } from '../users/models/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Board, User])],
  controllers: [PostsController],
  providers: [PostsService, BoardsService],
})
export class PostsModule {}
