import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto, EditBoardDto } from './dtos';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

@ApiTags('Boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all boards',
    description: 'This route retrieves the details of all boards.',
    operationId: 'fetchBoards',
  })
  @ApiResponse({
    status: 200,
    description: 'Boards found',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          description: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getBoards() {
    try {
      return await this.boardsService.fetchBoards();
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Admin: Create a new board',
    description: 'This route allows creating a new board',
    operationId: 'createBoard',
  })
  @ApiResponse({
    status: 201,
    description: 'Board created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        description: { type: 'string' },
        createdAt: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UseGuards(new RolesAuthGuard('admin'))
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    try {
      return await this.boardsService.createBoard(createBoardDto);
    } catch (error) {
      throw new InternalServerErrorException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Admin: Update a board',
    description:
      'This route allows updating the details of a specific board identified by its boardId.',
    operationId: 'updateBoard',
  })
  @ApiResponse({
    status: 200,
    description: 'Board updated successfully',
    schema: {
      type: 'object',
      properties: {
        raw: { type: 'any' },
        affected: { type: 'number' },
        generatedMaps: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UseGuards(new RolesAuthGuard('admin'))
  // @UsePipes(new JoiValidatorPipe(editBoardSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() editBoardDto: EditBoardDto,
  ) {
    try {
      // const { id } = req.params;
      return await this.boardsService.updateBoard(id, editBoardDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Admin: Delete a board',
    description:
      'This route allows deleting a specific board identified by its boardId.',
    operationId: 'deleteBoard',
  })
  @ApiResponse({
    status: 204,
    description: 'Board deleted successfully',
    schema: {
      type: 'object',
      properties: {
        raw: { type: 'any' },
        affected: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized operation' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiCookieAuth()
  @UseGuards(new RolesAuthGuard('admin'))
  async deleteBoard(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.boardsService.deleteBoard(id);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }
}
