import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Repository } from 'typeorm';
import { Board } from './model/boards.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BoardsController', () => {
  let controller: BoardsController;
  let boardsRepository: Repository<Board>;
  let BOARD_REPOSITORY_TOKEN = getRepositoryToken(Board);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        BoardsService,
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
    boardsRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
