import * as path from 'path';

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './modules/companies/companies.module';

import appConfig from './config/app.config';
import appConfigSchema from './config/app.config.schema';
import { FirebaseAdminModule } from './modules/firebase-admin/firebase-admin.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CommonModule } from './common/common.module';

const NODE_ENV = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../.env.${NODE_ENV}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envPath,
      load: [appConfig],
      validationSchema: appConfigSchema
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production'
      })
    }),
    CompaniesModule,
    FirebaseAdminModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware)
      .forRoutes('');
  }    
}
