import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  EditPostDto,
  createPostSchema,
  editPostSchema,
} from './dtos';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidatorPipe } from '../utils/validation.pipe';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'List all posts under a board',
    description: 'Gets all posts using a board id',
    operationId: 'fetchPostsByBoardId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiCookieAuth()
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

  @Get(':boardId/:postId')
  @ApiOperation({
    summary: 'List all posts under a board',
    description: 'Gets all posts using a board id',
    operationId: 'fetchPostsByBoardId',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiCookieAuth()
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.postsService.fetchPostByPostId(id);
    } catch (error) {
      throw new NotFoundException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Post(':id')
  @ApiOperation({
    summary: 'Creates a posts on a board',
    description: 'Creates a post using on a board using a board ID',
    operationId: 'createPost',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiCookieAuth()
  @UsePipes(new JoiValidatorPipe(createPostSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async creatPost(
    // @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      return await this.postsService.createPost(createPostDto, id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':boardId/:postId')
  @ApiOperation({
    summary: 'Updates a post',
    description: 'Updates a post using the board ID and post ID',
    operationId: 'updatePost',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiCookieAuth()
  @UsePipes(new JoiValidatorPipe(editPostSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async updatePost(
    // @Param('boardId', ParseIntPipe) boardId: number,
    // @Param('postId', ParseIntPipe) postId: number,
    @Body() editPostDto: EditPostDto,
    @Req() req,
  ) {
    try {
      const { boardId, postId } = req.params;
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Deletes a post using the post ID and user ID',
    operationId: 'deletePost',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiCookieAuth()
  async deleteReply(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const userId = req.user.id;
      return await this.postsService.deletePost(id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
