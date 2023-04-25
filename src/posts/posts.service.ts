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
    try {
      return this.postRepository.find({
        where: {
          board: {
            id: boardId,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Error retrieving posts from board with id ${boardId}: ${error.message}`,
      );
    }
  }

  async fetchPostsByUserId(userId: number): Promise<Post[]> {
    try {
      return this.postRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }

  async createPost(postDetails: CreatePostDto, boardId: number): Promise<Post> {
    try {
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
    } catch (error) {
      throw new Error(`Error creating a posts: ${error.message}`);
    }
  }
}
