import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getBoards() {
    return await this.boardsService.fetchBoards();
  }

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardsService.createBoard(createBoardDto);
  }

  @Patch(':id')
  updateBoard(@Param('id', ParseIntPipe) id: number) {}

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: number) {}
}
