import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser(cookieSecret));

  // serving images is for future use whenever there will be a need to incorporate image posting
  // currently being used to serve user profile images
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('Meerkat API')
    .setDescription(
      'MeerKat-forum is an online space for open discussion, debate, and information ' +
        'sharing related to academic and social issues within the UNIMA community. This ' +
        'forum can provide opportunities to hear different perspectives and engage in ' +
        'constructive dialogue about current events, policies, and other relevant topics. It can ' +
        'also serve as a platform for organizing events, sharing resources, and building ' +
        'connections among students, faculty, and alumni. MeerKat contains sub-forums also ' +
        'called communities or discussion boards. ' +
        'Note: Most routes are cookie auth protected start in the auth section and try out the login route to access all the others',
    )
    .setContact(
      'Benedict Zuze; bsc-com-17-20',
      'https://github.com/bsc-com-17-20',
      'bsc-com-17-20@unima.ac.mw',
    )
    .setVersion('1.0')
    .addTag(
      'auth',
      'All about authentication and authorization, View a user profile. Use the login route first to access all routes',
    )
    .addTag('users', 'Everything about the user')
    .addTag(
      'boards',
      'Discussion groups/boards that contain related posts and replies',
    )
    .addTag('posts', 'Everything about a post')
    .addTag('replies', 'Everthing about a reply')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

// https://blog.devgenius.io/the-complete-modern-react-developer
