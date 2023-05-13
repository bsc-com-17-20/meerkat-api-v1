import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { LoginUserDto } from '../src/auth/dtos';
import { CreateUserDto } from '../src/users/dtos';
import { CreatePostDto } from '../src/posts/dtos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../src/boards/model/boards.entity';
import { Reply } from '../src/replies/models/replies.entity';
import { User } from '../src/users/models/users.entity';
import { Post } from '../src/posts/models/posts.entity';
import { AuthModule } from '../src/auth/auth.module';
import { BoardsModule } from '../src/boards/boards.module';
import { PostsModule } from '../src/posts/posts.module';
import { RepliesModule } from '../src/replies/replies.module';
import { UsersModule } from '../src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../src/auth/guards';

const account: LoginUserDto = {
  username: 'dennis23',
  password: '1234545678',
};

const createAccount: CreateUserDto = {
  username: 'dennis23',
  email: 'dennis23@gmail.com',
  password: '1234545678',
};

const createPost: CreatePostDto = {
  title: 'Some title',
  content: 'Some random content',
};

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'meerkat_v1_test',
            entities: [User, Board, Post, Reply],
            synchronize: true,
          }),
        }),
        UsersModule,
        BoardsModule,
        PostsModule,
        AuthModule,
        RepliesModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser('Ever watched fight club it is a realy good movie'));
    await app.init();
  });

  describe('POST /auth/register', () => {
    it('should return 201 for successful operation', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createAccount)
        .expect(201);
    }, 30000);
  });

  describe('POST /auth/login', () => {
    it('should return 201 if user is authenticated', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(account)
        .expect(201);
    });
  });

  describe('GET /auth/profile', () => {
    it('should return 200 if user is authenticated', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      await agent.get('/auth/profile').expect(200);
    });

    it('should return 401 if user is unauthorized', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('GET /users/:username', () => {
    it('should return 200 if user is authenticated', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      await agent.get(`/users/${account.username}`).expect(200);
    });
  });

  describe('GET /boards', () => {
    it('/boards (GET)', async () => {
      await request(app.getHttpServer()).get('/boards').expect(200);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return 200 if user is authenticated', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      await agent.get(`/posts/1`).expect(200);
    });
  });

  describe('POST /posts/:id and DELETE /posts/:postId', () => {
    it('should return 201 if user is authenticated', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      const response = await agent
        .post(`/posts/1`)
        .send(createPost)
        .expect(201);
      const { id } = response.body;
      await agent.delete(`/posts/${id}`).expect(200);
    });
  });

  describe('PATCH /posts/:boardId/:postId and DELETE /posts/:postId', () => {
    it('should return 201 if user is authenticated', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      const response = await agent
        .post(`/posts/1`)
        .send(createPost)
        .expect(201);
      const { id } = response.body;
      await agent.patch(`/posts/1/${id}`).send(createPost).expect(200);
      await agent.delete(`/posts/${id}`).expect(200);
    });
  });

  describe('DELETE /users/:username', () => {
    it('should delete the user and return 200 for successful operation', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      await agent.delete(`/users/${account.username}`).expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
