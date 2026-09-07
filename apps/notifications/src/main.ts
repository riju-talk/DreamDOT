import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as dotenv from 'dotenv';

// Local dev convenience: load the repo-root .env if present. On a PaaS / in a
// container the platform supplies env vars and this file won't exist.
const rootEnv = resolve(__dirname, '../../../.env');
if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

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
