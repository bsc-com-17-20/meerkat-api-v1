import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as cookieParser from 'cookie-parser';
import { LoginUserDto } from '../src/auth/dtos';
import { CreateUserDto } from '../src/users/dtos';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../src/boards/model/boards.entity';
import { Reply } from '../src/replies/models/replies.entity';
import { User } from '../src/users/models/users.entity';
import { Post } from '../src/posts/models/posts.entity';

const account: LoginUserDto = {
  username: 'dennis23',
  password: '1234545678',
};

const createAccount: CreateUserDto = {
  username: 'dennis23',
  email: 'dennis23@gmail.com',
  password: '1234545678',
};

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: 'meerkat_v1_test',
          entities: [User, Board, Post, Reply],
          synchronize: true,
        }),
      ],
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
    });
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

  describe('GET /boards', () => {
    it('/boards (GET)', async () => {
      await request(app.getHttpServer()).get('/boards').expect(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete the user and return 200 for succeful operation', async () => {
      const agent = request.agent(app.getHttpServer());
      await agent.post('/auth/login').send(account).expect(201);
      const response = await agent.get(`/users/${account.username}`);
      const { id } = response.body;
      await agent.delete(`/users/${id}`).expect(200);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
