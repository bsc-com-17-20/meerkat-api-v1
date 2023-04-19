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
import { CreateBoardDto, EditBoardDto } from './dtos';

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
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() editBoardDto: EditBoardDto,
  ) {
    return await this.boardsService.updateBoard(id, editBoardDto);
  }

  @Delete(':id')
  async deleteBoard(@Param('id', ParseIntPipe) id: number) {
    return await this.boardsService.deleteBoard(id);
  }
}
