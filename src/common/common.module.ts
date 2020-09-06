import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../config/app.config';

import { AuthorizationGuard } from './guards/authorization.guard';

import { FirebaseAdminModule } from './plugins/firebase-admin/firebase-admin.module';

import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    FirebaseAdminModule
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthorizationGuard }]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware)
      .forRoutes(
      {
        path: 'companies',
        method: RequestMethod.ALL
      },
      {
        path: 'users',
        method: RequestMethod.ALL
      });
  }

}
