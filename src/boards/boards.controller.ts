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

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getBoards() {
    await this.boardsService.fetchUsers();
  }

  @Post()
  createBoard() {}

  @Patch(':id')
  updateBoard(@Param('id', ParseIntPipe) id: number) {}

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: number) {}
}
