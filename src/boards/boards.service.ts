import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './model/boards.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dtos';

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
}
