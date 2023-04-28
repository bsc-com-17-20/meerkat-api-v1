import { Test, TestingModule } from '@nestjs/testing';
import { RepliesController } from './replies.controller';
import { Repository } from 'typeorm';
import { Reply } from './models/replies.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RepliesService } from './replies.service';
import { Post } from '../posts/models/posts.entity';
import { Board } from '../boards/model/boards.entity';
import { User } from '../users/models/users.entity';

describe('RepliesController', () => {
  let controller: RepliesController;
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
          useValue: {},
        },
        {
          provide: POST_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: BOARD_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RepliesController>(RepliesController);
    replyRepository = module.get<Repository<Reply>>(REPLY_REPOSITORY_TOKEN);
    postRepository = module.get<Repository<Post>>(POST_REPOSITORY_TOKEN);
    boardRepository = module.get<Repository<Board>>(BOARD_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
