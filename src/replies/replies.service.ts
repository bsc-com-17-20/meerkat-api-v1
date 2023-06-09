import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './models/replies.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from '../posts/models/posts.entity';
import { User } from '../users/models/users.entity';
import { CreateReplyDto, EditReplyDto } from './dtos';
import { Role } from '../users/models/role.enum';

@Injectable()
export class RepliesService {
  logger: Logger = new Logger(RepliesService.name);
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchAllReplies(postId: number): Promise<Reply[]> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        this.logger.log(post);
        throw new HttpException(
          `Post with id ` + postId + ' is not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.replyRepository.find({
        where: {
          post: {
            id: postId,
          },
        },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async createReply(
    replyDetails: CreateReplyDto,
    postId: number,
    userId: number,
  ): Promise<Reply> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const post = await this.postRepository.findOneBy({ id: postId });
      if (!post) {
        throw new NotFoundException(`Post with id ` + postId + ' is not found');
      }
      const newReply = this.replyRepository.create({
        ...replyDetails,
        updateAt: new Date(),
        post,
        user,
      });
      await this.replyRepository.save(newReply);
      return newReply;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateReply(
    replyDetails: EditReplyDto,
    replyId: number,
    postId: number,
    userId: number,
    userRole,
  ): Promise<UpdateResult> {
    try {
      const ownership = await this.checkUserOwnership(replyId, userId);
      if (ownership || userRole == userRole) {
        const user = await this.userRepository.findOneBy({ id: userId });
        const post = await this.postRepository.findOneBy({ id: postId });
        if (!post) {
          throw new NotFoundException(
            `Post with id ` + postId + ' is not found',
          );
        }
        return this.replyRepository.update(
          { id: replyId },
          { ...replyDetails, updateAt: new Date(), edited: true, post, user },
        );
      }
      throw new ForbiddenException(
        `Error user does not own the reply user id ${userId}`,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteReply(
    replyId: number,
    userId: number,
    userRole,
  ): Promise<DeleteResult> {
    try {
      const ownership = await this.checkUserOwnership(replyId, userId);
      if (ownership || userRole == Role.ADMIN) {
        return this.replyRepository.delete({ id: replyId });
      }
      throw new ForbiddenException(
        `Error user does not own the reply user id ${userId}`,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // Inorder for a user to delete and update a reply. We need to make sure they own the reply
  async checkUserOwnership(replyId: number, userId: number): Promise<boolean> {
    try {
      const reply = await this.replyRepository.findOne({
        where: {
          id: replyId,
          user: {
            id: userId,
          },
        },
      });
      if (!reply) {
        return false;
      }
      return true;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
