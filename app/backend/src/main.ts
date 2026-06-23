import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.1.21:3000',
      'https://staging.divingoclub.com',
      'https://divingoclub.com',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Swagger / OpenAPI documentation — exposed in LOCAL development only.
  // Staging and production set NODE_ENV explicitly, so the API map is never
  // published there. Served at /docs (http://localhost:3001/docs).
  if (!['staging', 'production'].includes(process.env.NODE_ENV ?? '')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Diving O Club API')
      .setDescription(
        'REST API for the Diving O Club association management application.',
      )
      .setVersion('1.0')
      // Auth is a JWT stored in an HttpOnly cookie named "access_token".
      .addCookieAuth('access_token', {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT issued at login, stored in an HttpOnly cookie.',
      })
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
