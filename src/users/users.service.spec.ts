import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto, ResponseUserDto, UpdateUserDto } from './dtos';
import * as download from 'image-downloader';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return a user object ', async () => {
      const user: CreateUserDto = {
        username: 'john',
        email: 'john@email.com',
        password: '12345678',
      };

      const createUser = {
        username: 'john',
        email: 'john@email.com',
        imageURL: expect.any(String),
        hash: expect.any(String),
      };

      const expectedSpyResult = {
        id: expect.any(Number),
        username: 'john',
        email: 'john@email.com',
        hash: expect.any(String),
        imageURL: expect.any(String),
        posts: [],
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
      };

      const downloadResult: download.DownloadResult = {
        filename: expect.any(String),
      };

      jest.spyOn(download, 'image').mockResolvedValue(downloadResult);
      const createSpy = jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(expectedSpyResult);
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(expectedSpyResult);
      const result = await service.createUser(user);
      expect(createSpy).toHaveBeenCalledWith(createUser);
      expect(saveSpy).toHaveBeenCalledWith(expectedSpyResult);
      expect(result).toEqual(expectedSpyResult);
    });
  });

  describe('fetchUsers', () => {
    it('should return an array of user objetcs', async () => {
      const expectedSpyResult: ResponseUserDto[] = [];
      const expectedResponse: User[] = [];
      const findSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(expectedResponse);
      const result = await service.fetchUsers();
      expect(findSpy).toBeCalledTimes(1);
      expect(result).toEqual(expectedSpyResult);
    });
  });

  describe('fetchUser', () => {
    it('should return a user object using an id', async () => {
      const expectedSpyResult: ResponseUserDto = {
        id: 1,
        role: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
      };
      const expectedFindSpyResult: User = {
        id: 1,
        role: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        hash: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
      };
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedFindSpyResult);
      const result = await service.fetchUser(1);
      expect(findOneBySpy).toBeCalledWith({ id: 1 });
      expect(result).toEqual(expectedSpyResult);
    });
  });

  describe('findOne', () => {
    it('should return a user object using a username', async () => {
      const expectedSpyResult: User = {
        id: expect.any(Number),
        role: expect.any(String),
        username: 'john',
        hash: expect.any(String),
        email: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
      };
      const findOneBySpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedSpyResult);
      const result = await service.findOne('john');
      expect(findOneBySpy).toBeCalledWith({ username: 'john' });
      expect(result).toEqual(expectedSpyResult);
    });
  });

  describe('updateUser', () => {
    it('should update a user object and return a UpdateResult object', async () => {
      const updateContent: UpdateUserDto = {
        username: 'john',
        email: 'john@email.com',
        password: '12345',
      };
      const expectedFetchUserSpyResult: ResponseUserDto = {
        id: 1,
        role: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
      };
      const expectedSpyResult: UpdateResult = {
        raw: [],
        generatedMaps: [],
        affected: 1,
      };
      const fetchUserSpy = jest
        .spyOn(service, 'fetchUser')
        .mockResolvedValue(expectedFetchUserSpyResult);
      const updateSpy = jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue(expectedSpyResult);
      const result = await service.updateUser(1, updateContent);
      expect(fetchUserSpy).toBeCalledWith(1);
      expect(updateSpy).toBeCalledWith(
        { id: 1 },
        { ...updateContent, updatedAt: expect.any(Date) },
      );
      expect(result).toEqual(expectedSpyResult);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user object and return a DeleteResult object', async () => {
      const expectedFetchUserSpyResult: User = {
        id: 1,
        role: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        imageURL: expect.any(String),
        hash: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
      };
      const expectedSpyResult: DeleteResult = {
        raw: [],
        affected: 1,
      };
      const fetchUserSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(expectedFetchUserSpyResult);
      const deleteSpy = jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValue(expectedSpyResult);
      const result = await service.deleteuser('dave');
      expect(fetchUserSpy).toBeCalledWith('dave');
      expect(deleteSpy).toBeCalledWith({ username: 'dave' });
      expect(result).toEqual(expectedSpyResult);
    });
  });
});
