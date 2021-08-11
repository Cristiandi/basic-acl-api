import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

import { CompanyModule } from './modules/company/company.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // GraphQL
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: 'schema.gql',
          introspection: true,
          installSubscriptionHandlers: true,
          playground:
            configService.get<string>('config.environment') === 'development',
        };
      },
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('config.database.host'),
          port: configService.get<number>('config.database.port'),
          username: configService.get<string>('config.database.user'),
          password: configService.get<string>('config.database.password'),
          database: configService.get<string>('config.database.database'),
          autoLoadEntities: true,
          synchronize:
            configService.get<string>('config.environment') !== 'production',
          logging:
            configService.get<string>('config.environment') !== 'production',
        };
      },
    }),

    CompanyModule,

    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
