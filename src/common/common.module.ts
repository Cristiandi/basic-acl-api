import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import appConfig from 'src/config/app.config';

import { ApiKeyGuard } from './guards/api-key.guard';


import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware)
      .forRoutes({
        path: 'companies',
        method: RequestMethod.ALL
      });
  }

}
