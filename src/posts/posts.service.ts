import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos';
import { Board } from 'src/boards/model/boards.entity';

@Injectable()
export class PostsService {
  private logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async fetchPostsByBoardId(boardId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        board: {
          id: boardId,
        },
      },
    });
  }

  async createPost(postDetails: CreatePostDto, boardId: number) {
    const board = await this.boardRepository.findOneBy({ id: boardId });
    const post = {
      title: postDetails.title,
      content: postDetails.content,
      board,
    };
    this.logger.log(post);
    const newPost = this.postRepository.create({ ...post });
    this.logger.log(newPost);
    return this.postRepository.save(newPost);
  }
}
