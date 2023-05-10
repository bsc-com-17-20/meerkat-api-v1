import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from '../boards/model/boards.entity';
import { Reply } from '../replies/models/replies.entity';
import { RepliesService } from '../replies/replies.service';
import { User } from '../users/models/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Post } from './models/posts.entity';
import { CreatePostDto } from './dtos';

const expectedBoard: Board = {
  id: 1,
  name: expect.any(String),
  description: expect.any(String),
  createdAt: expect.any(Date),
  posts: [],
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
};

describe('PostsService', () => {
  let service: PostsService;
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
      providers: [
        PostsService,
        RepliesService,
        {
          provide: REPLY_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    replyRepository = module.get<Repository<Reply>>(REPLY_REPOSITORY_TOKEN);
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    boardRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchPostsByBoardId', () => {
    it('should return an array of Post objects using the board id', async () => {
      const expectedResult: Post[] = [];
      const findSpy = jest
        .spyOn(postRepository, 'find')
        .mockResolvedValue(expectedResult);
      const result: Post[] = await service.fetchPostsByBoardId(1);
      expect(findSpy).toBeCalledWith({
        where: { board: { id: expect.any(Number) } },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('fetchPostsByUserId', () => {
    it("should return an array of Post objects using the user's id", async () => {
      const expectedResult: Post[] = [];
      const findSpy = jest
        .spyOn(postRepository, 'find')
        .mockResolvedValue(expectedResult);
      const result: Post[] = await service.fetchPostsByUserId(1);
      expect(findSpy).toBeCalledWith({
        where: { user: { id: expect.any(Number) } },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createPost', () => {
    it('should create a post and return a post object', async () => {
      const postDetails: CreatePostDto = {
        title: 'something random',
        content: 'somethind wild stuff',
      };
      const expectedPost: Post = {
        id: expect.any(Number),
        title: 'something random',
        content: 'somethind wild stuff',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        edited: expect.any(Boolean),
        board: expect.any(Board),
        user: expect.any(User),
        replies: [],
      };
      const boardFindByOneSpy = jest
        .spyOn(boardRepository, 'findOneBy')
        .mockResolvedValue(expectedBoard);
      const userFindByOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedUser);
      const createSpy = jest
        .spyOn(postRepository, 'create')
        .mockReturnValue(expectedPost);
      const saveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(expectedPost);
      const result: Post = await service.createPost(postDetails, 1, 1);
      expect(boardFindByOneSpy).toBeCalledWith({ id: 1 });
      expect(userFindByOneSpy).toBeCalledWith({ id: 1 });
      expect(createSpy).toBeCalled();
      expect(saveSpy).toBeCalled();
      expect(result).toEqual(expectedPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post and return an UpdateResult object', async () => {
      const expectedResult: UpdateResult = {
        raw: [],
        generatedMaps: [],
        affected: 1,
      };

      const postDetails: CreatePostDto = {
        title: 'something random',
        content: 'somethind wild stuff',
      };

      const boardFindByOneSpy = jest
        .spyOn(boardRepository, 'findOneBy')
        .mockResolvedValue(expectedBoard);
      const userFindByOneSpy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(expectedUser);
      jest.spyOn(service, 'checkUserOwnership').mockResolvedValue(true);
      const updateSpy = jest
        .spyOn(postRepository, 'update')
        .mockResolvedValue(expectedResult);
      const result: UpdateResult = await service.updatePost(
        1,
        postDetails,
        1,
        1,
      );
      expect(boardFindByOneSpy).toBeCalledWith({ id: 1 });
      expect(userFindByOneSpy).toBeCalledWith({ id: 1 });
      expect(updateSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return a DeleteResult object', async () => {
      const expectedResult: DeleteResult = {
        raw: [],
        affected: 1,
      };
      const deleteSpy = jest
        .spyOn(postRepository, 'delete')
        .mockResolvedValue(expectedResult);
      jest.spyOn(service, 'checkUserOwnership').mockResolvedValue(true);
      const result: DeleteResult = await service.deletePost(1, 1);
      expect(deleteSpy).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});
