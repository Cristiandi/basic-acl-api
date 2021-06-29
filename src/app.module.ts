import * as path from 'path';

import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { CompaniesModule } from './modules/companies/companies.module';

const NODE_ENV = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../.env.${NODE_ENV}`);

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      envFilePath: envPath,
      load: [appConfig],
    }),

    // GraphQL
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: NODE_ENV === 'development',
      introspection: true,
      installSubscriptionHandlers: true,
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
      }),
    }),

    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
