import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
// import { ClusterService } from './cluster.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // getting the config service
  const configService = app.get(ConfigService);

  // getting the port env var
  const PORT = configService.get<number>('config.app.port' as never);

  // getting the environment var
  const ENV = configService.get<string>('config.environment' as never);

  app.enableCors();
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(PORT, () => {
    Logger.log(`app listening at ${PORT} in ${ENV}`, 'main.ts');
  });
}

// ClusterService.clusterize(bootstrap);

bootstrap();
