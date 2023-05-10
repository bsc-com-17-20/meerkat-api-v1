import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Board } from './model/boards.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBoardDto, EditBoardDto } from './dtos';

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
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    boardsRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchBoards', () => {
    it('should return an array of board objects', async () => {
      const expectedResult: Board[] = [];
      const findSpy = jest
        .spyOn(boardsRepository, 'find')
        .mockResolvedValue(expectedResult);
      const result = await service.fetchBoards();
      expect(findSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createBoard', () => {
    it('should create a board and return the board object', async () => {
      const boardDetails: CreateBoardDto = {
        name: 'Computer Science',
        description: 'Anything and everything Computer Science related',
      };
      const expectResult: Board = {
        id: expect.any(Number),
        name: 'Computer Science',
        description: 'Anything and everything Computer Science related',
        createdAt: expect.any(Date),
        posts: [],
      };
      const createSpy = jest
        .spyOn(boardsRepository, 'create')
        .mockReturnValue(expectResult);
      const saveSpy = jest
        .spyOn(boardsRepository, 'save')
        .mockResolvedValue(expectResult);
      const result: Board = await service.createBoard(boardDetails);
      expect(createSpy).toBeCalledWith({ ...boardDetails });
      expect(saveSpy).toBeCalledWith(expectResult);
      expect(result).toEqual(expectResult);
    });
  });

  describe('updateBoard', () => {
    it('should update a board using an id and return an UpdateResult object', async () => {
      const boardDetails: EditBoardDto = {
        name: 'Computer Science',
        description: 'Anything and everything Computer Science related',
      };
      const expectResult: UpdateResult = {
        raw: [],
        generatedMaps: [],
        affected: 1,
      };
      jest.spyOn(boardsRepository, 'update').mockResolvedValue(expectResult);
      const result: UpdateResult = await service.updateBoard(1, boardDetails);
      expect(result).toEqual(expectResult);
    });
  });

  describe('deleteBoard', () => {
    it('should delete a board an return a DeleteResult object', async () => {
      const expectedSpyResult: DeleteResult = {
        raw: [],
        affected: 1,
      };
      const deleteSpy = jest
        .spyOn(boardsRepository, 'delete')
        .mockResolvedValue(expectedSpyResult);
      const result: DeleteResult = await service.deleteBoard(1);
      expect(deleteSpy).toBeCalledWith({ id: 1 });
      expect(result).toEqual(expectedSpyResult);
    });
  });
});
