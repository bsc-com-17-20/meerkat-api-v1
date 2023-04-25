import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    UsersModule,
    BoardsModule,
    PostsModule,
    AuthModule,
    RepliesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
