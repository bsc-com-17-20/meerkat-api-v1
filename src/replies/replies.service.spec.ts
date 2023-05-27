import { Test, TestingModule } from '@nestjs/testing';
import { RepliesService } from './replies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from '../boards/model/boards.entity';
import { Post } from '../posts/models/posts.entity';
import { User } from '../users/models/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Reply } from './models/replies.entity';
import { RepliesController } from './replies.controller';
import { CreateReplyDto } from './dtos';

const expectedPost: Post = {
  id: expect.any(Number),
  title: expect.any(String),
  content: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  edited: expect.any(Boolean),
  board: expect.any(Board),
  user: expect.any(User),
  replies: [],
};

const expectedUser: User = {
  id: 1,
  role: expect.any(String),
  username: expect.any(String),
  hash: expect.any(String),
  email: expect.any(String),
  imageURL: expect.any(String),
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  posts: [],
  replies: [],
  confimationCode: expect.any(String),
  status: expect.any(String),
};

const replyDetails: CreateReplyDto = {
  content: expect.any(String),
};

describe('RepliesService', () => {
  let service: RepliesService;
  let replyRepository: Repository<Reply>;
  let postRepository: Repository<Post>;
  let boardRepository: Repository<Board>;
  let userRepository: Repository<User>;
  const REPLY_REPOSITORY_TOKEN = getRepositoryToken(Reply);
  const POST_REPOSITORY_TOKEN = getRepositoryToken(Post);
  const BOARD_REPOSITORY_TOKEN = getRepositoryToken(Board);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepliesController],
      providers: [
        RepliesService,
        {
          provide: REPLY_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RepliesService>(RepliesService);
    replyRepository = module.get<Repository<Reply>>(REPLY_REPOSITORY_TOKEN);
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    boardRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchAllReplies', () => {
    it('should return an array of reply objects using post id', async () => {
      const expectedResult: Reply[] = [];
      const findSpy = jest
        .spyOn(replyRepository, 'find')
        .mockResolvedValue(expectedResult);
      const result: Reply[] = await service.fetchAllReplies(1);
      expect(findSpy).toBeCalledWith({ where: { post: { id: 1 } } });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createReply', () => {
    it('should create a reply and return a reply object', async () => {
      const expectedReply: Reply = {
        id: expect.any(Number),
        content: expect.any(String),
        createdAt: expect.any(Date),
        updateAt: expect.any(Date),
        edited: false,
        post: expect.any(Post),
        user: expect.any(User),
      };

      const findOneByUserSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedUser);
      const findOneByPostSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(expectedPost);
      const createSpy = jest
        .spyOn(replyRepository, 'create')
        .mockReturnValue(expectedReply);
      const saveSpy = jest
        .spyOn(replyRepository, 'save')
        .mockResolvedValue(expectedReply);
      const result: Reply = await service.createReply(replyDetails, 1, 1);
      expect(findOneByUserSpy).toBeCalled();
      expect(findOneByPostSpy).toBeCalled();
      expect(createSpy).toBeCalled();
      expect(saveSpy).toBeCalled();
      expect(result).toEqual(expectedReply);
    });
  });

  describe('updateReply', () => {
    it('should update a reply and return an UpdateResult object', async () => {
      const expectedResult: UpdateResult = {
        raw: [],
        generatedMaps: [],
        affected: 1,
      };
      jest.spyOn(service, 'checkUserOwnership').mockResolvedValue(true);
      const findOneByUserSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedUser);
      const findOneByPostSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(expectedPost);
      const updateSpy = jest
        .spyOn(replyRepository, 'update')
        .mockResolvedValue(expectedResult);
      const result: UpdateResult = await service.updateReply(
        replyDetails,
        1,
        1,
        1,
      );
      expect(findOneByUserSpy).toBeCalled();
      expect(findOneByPostSpy).toBeCalled();
      expect(updateSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
  describe('deleteReply', () => {
    it('should delete a reply and return a DeleteResult object', async () => {
      const expectedResult: DeleteResult = {
        raw: [],
        affected: 1,
      };
      jest.spyOn(service, 'checkUserOwnership').mockResolvedValue(true);
      const deleteSpy = jest
        .spyOn(replyRepository, 'delete')
        .mockResolvedValue(expectedResult);
      const result: DeleteResult = await service.deleteReply(1, 1);
      expect(deleteSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
