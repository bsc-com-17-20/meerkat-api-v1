import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './models/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';

const userArray = [
  {
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
  },
  {
    id: expect.any(Number),
    username: 'ben',
    email: 'ben@email.com',
    hash: expect.any(String),
    imageURL: expect.any(String),
    posts: [],
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
  },
];

const oneUser = {
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
            find: jest.fn().mockResolvedValue(userArray),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
            remove: jest.fn(),
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
    it('should create a new user an return it', async () => {
      const user: CreateUserDto = {
        username: 'john',
        email: 'john@email.com',
        password: '12345678',
      };

      expect(service.createUser(user)).resolves.toEqual(oneUser);
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
