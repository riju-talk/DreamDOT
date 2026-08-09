import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: (process.env.CORS_ORIGIN || 'http://localhost:5000').split(','),
      credentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = parseInt(process.env.PORT || '3003', 10);
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`[notifications] listening on ${host}:${port}`);
}

bootstrap();
