import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Board } from '../boards/model/boards.entity';
import { Reply } from '../replies/models/replies.entity';
import { RepliesService } from '../replies/replies.service';
import { User } from '../users/models/users.entity';
import { Repository } from 'typeorm';
import { Post } from './models/posts.entity';

// {
//   "generatedMaps": [],
//   "raw": [],
//   "affected": 1
// }

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
});
