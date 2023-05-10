import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './model/boards.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateBoardDto, EditBoardDto } from './dtos';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async fetchBoards(): Promise<Board[]> {
    try {
      const boards = this.boardRepository.find();
      return boards;
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }

  async createBoard(boardDetails: CreateBoardDto): Promise<Board> {
    try {
      const newBoard = this.boardRepository.create({ ...boardDetails });
      return this.boardRepository.save(newBoard);
    } catch (error) {
      throw new Error(`Error creating a board: ${error.message}`);
    }
  }

  async updateBoard(
    id: number,
    boardDetails: EditBoardDto,
  ): Promise<UpdateResult> {
    try {
      return this.boardRepository.update({ id }, { ...boardDetails });
    } catch (error) {
      throw new Error(`Error updating board with id ${id}: ${error.message}`);
    }
  }

  async deleteBoard(id: number): Promise<DeleteResult> {
    try {
      return this.boardRepository.delete({ id });
    } catch (error) {
      throw new Error(`Error retrieving users: ${error.message}`);
    }
  }
}
