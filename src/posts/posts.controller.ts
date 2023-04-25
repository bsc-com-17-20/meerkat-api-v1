import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiTags('posts')
  @ApiProperty({ description: 'Gets all posts using a board id' })
  @Get(':id')
  async getAllPosts(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.postsService.fetchPostsByBoardId(id);
    } catch (error) {
      throw new NotFoundException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @ApiTags('posts')
  @ApiProperty({ description: 'Creates a post' })
  @Post(':id')
  async creatPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      return await this.postsService.createPost(createPostDto, id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
