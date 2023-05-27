import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reply } from './models/replies.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from '../posts/models/posts.entity';
import { User } from '../users/models/users.entity';
import { CreateReplyDto, EditReplyDto } from './dtos';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async fetchAllReplies(postId: number): Promise<Reply[]> {
    try {
      return this.replyRepository.find({
        where: {
          post: {
            id: postId,
          },
        },
      });
    } catch (error) {
      throw new Error(
        `Error retrieving posts from board with id ${postId}: ${error.message}`,
      );
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
        post,
        user,
      });
      await this.replyRepository.save(newReply);
      return newReply;
    } catch (error) {
      throw new Error(`Error creating a reply: ${error.message}`);
    }
  }

  async updateReply(
    replyDetails: EditReplyDto,
    replyId: number,
    postId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      const ownership = await this.checkUserOwnership(replyId, userId);
      if (ownership) {
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
      throw Error(`Error user does not own the reply user id ${userId}`);
    } catch (error) {
      throw new Error(
        `Error updating reply from post with id ${postId}: ${error.message}`,
      );
    }
  }

  async deleteReply(replyId: number, userId: number): Promise<DeleteResult> {
    try {
      const ownership = await this.checkUserOwnership(replyId, userId);
      if (ownership) {
        return this.replyRepository.delete({ id: replyId });
      }
      throw Error(`Error user does not own the reply user id ${userId}`);
    } catch (error) {
      throw new Error(
        `Error deleting reply with id ${replyId}: ${error.message}`,
      );
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
      throw new Error('Something went wrong');
    }
  }
}
