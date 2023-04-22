import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';

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
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user an return it', async () => {
      const expectedResponse: User = {
        id: expect.any(Number),
        name: 'john',
        email: 'john@email.com',
        hash: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
      };
      jest.spyOn(userRepository, 'create').mockReturnValue(expectedResponse);
      jest.spyOn(userRepository, 'save').mockResolvedValue(expectedResponse);

      const result = await service.createUser({
        name: 'john',
        email: 'john@email.com',
        hash: '123',
      });
      console.log(result);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('fetchUsers', () => {
    it('should return an array of users', async () => {
      const expectedResponse = [new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValue(expectedResponse);
      const result = await service.fetchUsers();
      expect(result).toEqual(expectedResponse);
    });
  });
});
