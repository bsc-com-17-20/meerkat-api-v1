import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reply } from '../replies/models/replies.entity';
import { Repository } from 'typeorm';
import { Post } from './models/posts.entity';
import { User } from '../users/models/users.entity';
import { PostsService } from './posts.service';
import { Board } from '../boards/model/boards.entity';

describe('PostsController', () => {
  let controller: PostsController;
  let replyRepository: Repository<Reply>;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;
  let boardRepository: Repository<Board>;
  const REPLY_REPOSITORY_TOKEN = getRepositoryToken(Reply);
  const POST_REPOSITORY_TOKEN = getRepositoryToken(Post);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const BOARD_REPOSITORY_TOKEN = getRepositoryToken(Board);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: REPLY_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    replyRepository = module.get<Repository<Reply>>(REPLY_REPOSITORY_TOKEN);
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    boardRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
