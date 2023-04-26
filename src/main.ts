import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const cookieSecret = configService.get<string>('COOKIE_SECRET');

  app.use(helmet());
  app.use(cookieParser(cookieSecret));
  // serving images is for future use whenever there will be a need to incorporate image posting
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('Meerkat API')
    .setDescription(
      'MeerKat-forum is an online space for open discussion, debate, and information ' +
        'sharing related to academic and social issues within the UNIMA community.',
    )
    .setContact(
      'Benedict Zuze',
      'https://github.com/bsc-com-17-20',
      'bsc-com-17-20@unima.ac.mw',
    )
    .setVersion('1.0')
    .addTag('meerkat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

// https://blog.devgenius.io/the-complete-modern-react-developer
