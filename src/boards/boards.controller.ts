import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto, EditBoardDto } from './dtos';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @ApiTags('boards')
  @ApiProperty({
    description: 'Returns an array containing all the boards in the database',
  })
  @Get()
  async getBoards() {
    try {
      return await this.boardsService.fetchBoards();
    } catch (error) {
      throw new NotFoundException(`Something went wrong`, {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @ApiTags('boards')
  @ApiProperty({ description: 'Creates a board' })
  @Post()
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

  @ApiTags('boards')
  @ApiProperty({ description: 'Updates a board' })
  @Patch(':id')
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() editBoardDto: EditBoardDto,
  ) {
    try {
      return await this.boardsService.updateBoard(id, editBoardDto);
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
        description: `${error.message}`,
      });
    }
  }

  @ApiTags('boards')
  @ApiProperty({ description: 'Deletes a board' })
  @Delete(':id')
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
