import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get(':id')
  async getAllPosts(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.fetchPostsByBoardId(id);
  }

  @Post(':id')
  async creatPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.createPost(createPostDto, id);
  }
}
