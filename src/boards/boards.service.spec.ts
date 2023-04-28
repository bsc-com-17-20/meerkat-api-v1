import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { Repository } from 'typeorm';
import { Board } from './model/boards.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardsRepository: Repository<Board>;
  let BOARD_REPOSITORY_TOKEN = getRepositoryToken(Board);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    boardsRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
