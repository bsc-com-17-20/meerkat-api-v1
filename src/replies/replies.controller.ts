import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import {
  CreateReplyDto,
  EditReplyDto,
  createReplySchema,
  editReplySchema,
} from './dtos';
// import { JoiValidatorPipe } from '../utils/validation.pipe';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Replies')
@Controller('/boards/:boardId/posts/:postId/replies')
export class RepliesController {
  logger = new Logger(RepliesController.name);
  constructor(private readonly repliesService: RepliesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all replies in a post',
    description:
      'This route retrieves the details of all replies within a post, which belongs to a board.',
    operationId: 'fetchAllReplies',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Reply found',
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
  getRepliesByPostId(@Param('postId', ParseIntPipe) postId: number) {
    this.repliesService.fetchAllReplies(postId);
  }

  @Post()
  // @UsePipes(new JoiValidatorPipe(createReplySchema))
  @ApiOperation({
    summary: 'Create a new reply in a post',
    description:
      'This route allows creating a new reply within a specifc post, which belongs to a board',
    operationId: 'createReply',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reply created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
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
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async createReply(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createReplyDto: CreateReplyDto,
    @Req() req,
  ) {
    try {
      // const { id } = req.params;
      const userId = req.user.id;
      const response = await this.repliesService.createReply(
        createReplyDto,
        postId,
        userId,
      );
      delete response.user.hash;
      delete response.user.createdAt;
      delete response.user.updatedAt;
      delete response.user.imageURL;
      delete response.user.email;
      return response;
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':replyId')
  @ApiOperation({
    summary: 'Update a reply in a post',
    description:
      'This route allows updating the details of a specific reply within a post, which belongs to a board.',
    operationId: 'updateReply',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reply updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request payload',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Board, post, or reply not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiCookieAuth()
  // @UsePipes(new JoiValidatorPipe(editReplySchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async updateReply(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() editReplyDto: EditReplyDto,
    @Req() req,
  ) {
    try {
      // const { postId, replyId } = req.params;
      const userId = req.user.id;
      return await this.repliesService.updateReply(
        editReplyDto,
        replyId,
        postId,
        userId,
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Delete(':replyId')
  @ApiOperation({
    summary: 'Delete a reply from a post',
    description:
      'This route allows deleting a specific reply from a post, which belongs to a board.',
    operationId: 'deleteRply',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Reply deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Board, post, or reply not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiCookieAuth()
  async deleteReply(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.repliesService.deleteReply(replyId, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
