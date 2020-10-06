import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { RedisModule} from 'nestjs-redis';

import appConfig from '../config/app.config';

import { AuthorizationGuard } from './guards/authorization.guard';
import { HitLimitGuard } from './guards/hit-limit.guard';

import { FirebaseAdminModule } from './plugins/firebase-admin/firebase-admin.module';

import { LoggingMiddleware } from './middlewares/logging.middleware';
import { TemplatesModule } from './templates/templates.module';
import { MailerModule } from './plugins/mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    RedisModule.forRootAsync({
      useFactory: () => ({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        name: process.env.REDIS_CLIENT_NAME
      })
    }),
    FirebaseAdminModule,
    TemplatesModule,
    MailerModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard
    },
    {
      provide: APP_GUARD,
      useClass: HitLimitGuard
    }
  ]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware)
      .forRoutes('*');
  }

}
