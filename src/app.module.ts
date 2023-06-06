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
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailVerificationModule } from './email-verification/email-verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        url: process.env.DATABASE_URL,
        // host: process.env.DATABASE_HOST,
        // port: 3306,
        // username: process.env.DATABASE_USER,
        // password: process.env.DATABASE_PASSWORD,
        // database: process.env.DATABASE_NAME,
        entities: [User, Board, Post, Reply],
        migrations: [
          /*...*/
        ],
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 60, // second -> 60 secs = 1 min
        limit: 10, // number of requests per ttl value
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      },
    }),
    UsersModule,
    BoardsModule,
    PostsModule,
    AuthModule,
    RepliesModule,
    EmailVerificationModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
