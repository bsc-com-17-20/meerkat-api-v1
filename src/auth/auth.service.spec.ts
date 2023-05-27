import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../users/models/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from '../users/dtos';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, RequestUserDto } from './dtos';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user and return the user object', async () => {
      const expectedFindOnerSpyResult: User = {
        id: 1,
        role: expect.any(String),
        username: 'john',
        email: expect.any(String),
        hash: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
        confimationCode: expect.any(String),
        status: expect.any(String),
      };
      const expectedValidateUserSpyResult = {
        id: expect.any(Number),
        role: expect.any(String),
        username: 'john',
        email: expect.any(String),
        imageURL: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        posts: [],
        replies: [],
        status: expect.any(String),
        confimationCode: expect.any(String),
      };
      const findOneSpy = jest
        .spyOn(usersService, 'findOne')
        .mockResolvedValue(expectedFindOnerSpyResult);
      const compareSpy = jest
        .spyOn(bcrypt, 'compareSync')
        .mockReturnValue(true);
      const result = await service.validateUser('john', '12345');
      expect(findOneSpy).toBeCalledWith('john');
      expect(compareSpy).toBeCalled();
      expect(result).toEqual(expectedValidateUserSpyResult);
    });
  });

  describe('login', () => {
    it('should return an object with an access_token', async () => {
      const credentials: RequestUserDto = {
        id: expect.any(Number),
        role: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        imageURL: expect.any(String),
        createAt: expect.any(Date),
        updatedAt: expect.any(Date),
        confimationCode: expect.any(String),
        status: expect.any(String),
      };
      const expectedResult = {
        access_token: expect.any(String),
      };
      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(expect.any(String));
      const result = await service.login(credentials);
      expect(signSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
