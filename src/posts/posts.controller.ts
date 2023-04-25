import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, EditPostDto } from './dtos';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';

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
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async creatPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.postsService.createPost(createPostDto, id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @ApiTags('posts')
  @ApiProperty({ description: 'Updates a post in a board' })
  @Patch(':boardId/:postId')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() editPostDto: EditPostDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.postsService.updatePost(
        postId,
        editPostDto,
        boardId,
        userId,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
