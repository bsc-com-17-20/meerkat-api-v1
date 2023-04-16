import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Meerkat API')
    .setDescription(
      'MeerKat-forum is an online space for open discussion, debate, and information ' +
        'sharing related to academic and social issues within the UNIMA community.',
    )
    .setVersion('1.0')
    .addTag('meerkat')
    .addTag('forum')
    .addTag('api')
    .addTag('mysql')
    .addTag('node')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

// https://blog.devgenius.io/the-complete-modern-react-developer
