import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'https://staging.divingoclub.com', 'https://divingoclub.com'],
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();