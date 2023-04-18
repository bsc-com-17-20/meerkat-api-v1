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

@Controller('boards')
export class BoardsController {
  @Get()
  getBoards() {}

  @Post()
  createBoard() {}

  @Patch(':id')
  updateBoard(@Param('id', ParseIntPipe) id: number) {}

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) id: number) {}
}
