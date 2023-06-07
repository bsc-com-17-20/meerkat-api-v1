import {
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './models/posts.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePostDto, EditPostDto } from './dtos';
import { Board } from '../boards/model/boards.entity';
import { User } from '../users/models/users.entity';

@Injectable()
export class PostsService {
  private logger = new Logger(PostsService.name);
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(User) private userRepositoty: Repository<User>,
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
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
    }
  }

  async fetchPostByPostId(postId: number): Promise<Post[]> {
    try {
      return this.postRepository.find({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createPost(
    postDetails: CreatePostDto,
    boardId: number,
    userId: number,
  ): Promise<Post> {
    try {
      const board = await this.boardRepository.findOneBy({ id: boardId });
      if (!board) {
        throw new NotFoundException('Board not found');
      }
      const user = await this.userRepositoty.findOneBy({ id: userId });
      const newPost = this.postRepository.create({
        ...postDetails,
        updatedAt: new Date(),
        board,
        user,
      });
      this.logger.log(newPost);
      return this.postRepository.save(newPost);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updatePost(
    id: number,
    postDetails: EditPostDto,
    boardId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      const ownership = await this.checkUserOwnership(id, userId);
      this.logger.log(ownership);
      if (ownership) {
        const board = await this.boardRepository.findOneBy({ id: boardId });
        if (!board) {
          throw new NotFoundException('Board not found');
        }
        const user = await this.userRepositoty.findOneBy({ id: userId });
        return this.postRepository.update(
          { id },
          { ...postDetails, updatedAt: new Date(), edited: true, board, user },
        );
      }
      throw new ForbiddenException(
        'User does not own the post user id: ' + userId,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deletePost(postId: number, userId: number) {
    try {
      const ownership = await this.checkUserOwnership(postId, userId);
      if (ownership) {
        return this.postRepository.delete({ id: postId });
      }
      throw new ForbiddenException(
        `Error user does not own the post user id ${userId}`,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Inorder for a user to delete and update a posts. We need to make sure they own the post
  async checkUserOwnership(postId: number, userId: number): Promise<boolean> {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: postId,
          user: {
            id: userId,
          },
        },
      });
      if (!post) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
}
