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
// import { JoiValidatorPipe } from '../utils/validation.pipe';

@ApiTags('Posts')
@Controller('/boards/:boardId/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
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
  async getAllPosts(@Param('boardId', ParseIntPipe) boardId: number) {
    try {
      return await this.postsService.fetchPostsByBoardId(boardId);
    } catch (error) {
      throw new NotFoundException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Get(':postId')
  @ApiOperation({
    summary: 'List a post under a board',
    description: 'Gets a post using a board id and post id',
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
  async getPostById(@Param('postId', ParseIntPipe) postId: number) {
    try {
      return await this.postsService.fetchPostByPostId(postId);
    } catch (error) {
      throw new NotFoundException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new post in a board',
    description:
      'This route allows creating a new post within a specific board.',
    operationId: 'createPost',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post created successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Board not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiCookieAuth()
  // @UsePipes(new JoiValidatorPipe(createPostSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async creatPost(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ) {
    try {
      // let { id } = req.params;
      // id = parseInt(id);
      const userId = req.user.id;
      const post = await this.postsService.createPost(
        createPostDto,
        boardId,
        userId,
      );
      // remove sensitive info from public display
      delete post.user.hash;
      delete post.user.email;
      delete post.user.createdAt;
      delete post.user.updatedAt;
      delete post.user.posts;
      delete post.user.replies;
      delete post.user.imageURL;
      delete post.board.createdAt;
      return post;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':postId')
  @ApiOperation({
    summary: 'Update a post in a board',
    description:
      'This route allows updating the details of a specific post within a board.',
    operationId: 'updatePost',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Board or post not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiCookieAuth()
  // @UsePipes(new JoiValidatorPipe(editPostSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async updatePost(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() editPostDto: EditPostDto,
    @Req() req,
  ) {
    try {
      // const { boardId, postId } = req.params;
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

  @Delete(':postId')
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
  async deleteReply(@Param('postId', ParseIntPipe) postId: number, @Req() req) {
    try {
      const userId = req.user.id;
      return await this.postsService.deletePost(postId, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
