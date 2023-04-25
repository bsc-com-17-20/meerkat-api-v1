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
    return await this.boardsService.fetchBoards();
  }

  @ApiTags('boards')
  @ApiProperty({ description: 'Creates a board' })
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardsService.createBoard(createBoardDto);
  }

  @ApiTags('boards')
  @ApiProperty({ description: 'Updates a board' })
  @Patch(':id')
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @Body() editBoardDto: EditBoardDto,
  ) {
    return await this.boardsService.updateBoard(id, editBoardDto);
  }

  @ApiTags('boards')
  @ApiProperty({ description: 'Deletes a board' })
  @Delete(':id')
  async deleteBoard(@Param('id', ParseIntPipe) id: number) {
    return await this.boardsService.deleteBoard(id);
  }
}
