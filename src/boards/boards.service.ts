import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './model/boards.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto, EditBoardDto } from './dtos';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  fetchBoards() {
    return this.boardRepository.find();
  }

  createBoard(boardDetails: CreateBoardDto) {
    const newBoard = this.boardRepository.create({ ...boardDetails });
    return this.boardRepository.save(newBoard);
  }

  updateBoard(id: number, boardDetails: EditBoardDto) {
    return this.boardRepository.update({ id }, { ...boardDetails });
  }

  deleteBoard(id: number) {
    return this.boardRepository.delete({ id });
  }
}
