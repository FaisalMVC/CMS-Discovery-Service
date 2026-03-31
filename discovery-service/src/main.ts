import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Discovery Service')
    .setDescription('Content discovery and search API for programs and episodes')
    .setVersion('1.0')
    .addTag('programs', 'Browse and view programs')
    .addTag('episodes', 'Browse and view episodes')
    .addTag('search', 'Full-text search across content')
    .addTag('categories', 'Browse content categories')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.APP_PORT || 3001;
  await app.listen(port);
  logger.log(`Discovery service running on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
