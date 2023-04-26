import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/models/users.entity';
import { BoardsModule } from './boards/boards.module';
import { Board } from './boards/model/boards.entity';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/models/posts.entity';
import { AuthModule } from './auth/auth.module';
import { RepliesModule } from './replies/replies.module';
import { Reply } from './replies/models/replies.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Board, Post, Reply],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 60, // second -> 60 secs = 1 min
        limit: 10, // number of requests per ttl value
      }),
    }),
    UsersModule,
    BoardsModule,
    PostsModule,
    AuthModule,
    RepliesModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
