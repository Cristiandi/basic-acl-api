import helmet from 'fastify-helmet';

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  // getting the config service
  const configService = app.get(ConfigService);
  
  // enabling for cors policy
  app.enableCors();

  // use helmet
  await app.register(helmet, { hidePoweredBy: false });

  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = configService.get<number>('config.app.port');
  const ENVIRONMENT = configService.get<string>('config.environment');


  await app.listen(PORT, '0.0.0.0');
  
  Logger.debug(`server listening at ${PORT} | ${ENVIRONMENT} `, 'main.ts');
}
bootstrap();
