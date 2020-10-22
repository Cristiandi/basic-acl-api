import helmet from 'fastify-helmet';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  // getting the config service
  const configService = app.get(ConfigService);
  
  // enabling for cors policy
  // app.enableCors();

  // use helmet
  await app.register(helmet, { hidePoweredBy: false });
  
  // using the filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Setting up Swagger document 
  const options = new DocumentBuilder()
    .setTitle('Basic')
    .setDescription('The basic ACL api description.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = configService.get<number>('config.app.port');
  const ENVIRONMENT = configService.get<string>('config.environment');

  await app.listen(PORT, '0.0.0.0');
  
  Logger.debug(`server listening at ${PORT} | ${ENVIRONMENT} `, 'main.ts');
}
bootstrap();
