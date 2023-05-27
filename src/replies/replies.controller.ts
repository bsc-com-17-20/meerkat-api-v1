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
    summary: 'List all replies under a post',
    description: 'Gets all replies using a user ID',
    operationId: 'fetchAllReplies',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: 405, description: 'Invalid input' })
  @ApiCookieAuth()
  getRepliesByPostId(@Param('postId', ParseIntPipe) postId: number) {
    this.repliesService.fetchAllReplies(postId);
  }

  @Post()
  // @UsePipes(new JoiValidatorPipe(createReplySchema))
  @ApiOperation({
    summary: 'Add a new reply',
    description: 'Create a new reply to a post',
    operationId: 'createReply',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: 405, description: 'Invalid input' })
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
    summary: 'Updates a reply with form data',
    description: 'Updates a reply under a post (post ID)',
    operationId: 'updateReply',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: 405, description: 'Invalid input' })
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
    summary: 'Delete a reply',
    description: 'Deletes a reply using the replyID and userID',
    operationId: 'deleteRply',
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
