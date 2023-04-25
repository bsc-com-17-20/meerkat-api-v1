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

  async fetchBoards() {
    try {
      const boards = await this.boardRepository.find();
      return boards;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }

  async createBoard(boardDetails: CreateBoardDto) {
    try {
      const newBoard = this.boardRepository.create({ ...boardDetails });
      await this.boardRepository.save(newBoard);
      return newBoard;
    } catch (error) {
      throw new Error(`Error creating a board: ${error.message}`);
    }
  }

  async updateBoard(id: number, boardDetails: EditBoardDto) {
    try {
      return this.boardRepository.update({ id }, { ...boardDetails });
    } catch (error) {
      throw new Error(`Error updating board with id ${id}: ${error.message}`);
    }
  }

  async deleteBoard(id: number) {
    try {
      return this.boardRepository.delete({ id });
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }
}
