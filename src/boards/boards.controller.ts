import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import {
  CreateBoardDto,
  EditBoardDto,
  createBoardSchema,
  editBoardSchema,
} from './dtos';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';
import { JoiValidatorPipe } from '../utils/validation.pipe';

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List all boards',
    description: 'Returns an array containing all the boards in the database',
    operationId: 'fetchBoards',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
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

  @Post()
  @ApiOperation({
    summary: 'Admin: Create a new board',
    description: 'Creates a new board',
    operationId: 'createBoard',
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
  @UseGuards(new RolesAuthGuard('admin'))
  @UsePipes(new JoiValidatorPipe(createBoardSchema))
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
    summary: 'Admin: Edit a board using form data',
    description: 'Edits a board using form data',
    operationId: 'updateBoard',
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
  @UseGuards(new RolesAuthGuard('admin'))
  @UsePipes(new JoiValidatorPipe(editBoardSchema))
  // Do not use @Params() it is confilcting with the JoiValidator and messing up the validation use
  // manual req.params instead
  async updateBoard(
    // @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() editBoardDto: EditBoardDto,
  ) {
    try {
      const { id } = req.params;
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
    summary: 'Admin: Deletes a board',
    description: 'Deletes a board',
    operationId: 'deleteBoard',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized operation',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
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
