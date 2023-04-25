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
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiTags('posts')
  @ApiProperty({ description: 'Gets all posts using a board id' })
  @Get(':id')
  async getAllPosts(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.fetchPostsByBoardId(id);
  }

  @ApiTags('posts')
  @ApiProperty({ description: 'Creates a post' })
  @Post(':id')
  async creatPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.createPost(createPostDto, id);
  }
}
