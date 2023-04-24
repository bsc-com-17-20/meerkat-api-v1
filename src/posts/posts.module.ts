import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { BoardsService } from 'src/boards/boards.service';
import { Board } from 'src/boards/model/boards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Board])],
  controllers: [PostsController],
  providers: [PostsService, BoardsService],
})
export class PostsModule {}
