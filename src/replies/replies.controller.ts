import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateReplyDto, EditReplyDto, createReplySchema } from './dtos';
import { JoiValidatorPipe } from 'src/utils/validation.pipe';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('replies')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Get(':id')
  @ApiTags('replies')
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
  getRepliesByPostId(@Param('id', ParseIntPipe) id: number) {
    this.repliesService.fetchAllReplies(id);
  }

  @Post(':id')
  @ApiTags('replies')
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
  @UsePipes(new JoiValidatorPipe(createReplySchema))
  async createReply(
    @Param('id', ParseIntPipe) id: number,
    @Body() createReplyDto: CreateReplyDto,
    @Req() req,
  ) {
    try {
      const userId = req.user.id;
      return await this.repliesService.createReply(createReplyDto, id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':postId/:replyId')
  @ApiTags('replies')
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
  @UsePipes(new JoiValidatorPipe(createReplySchema))
  async updateReply(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() editReplyDto: EditReplyDto,
    @Req() req,
  ) {
    try {
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

  @Delete(':id')
  @ApiTags('replies')
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
  async deleteReply(@Param('id', ParseIntPipe) id: number, @Req() req) {
    try {
      const userId = req.user.id;
      return await this.repliesService.deleteReply(id, userId);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
