import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';

// import { loggerMiddleware } from './common/middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

import { CompanyModule } from './modules/company/company.module';
import { ProjectModule } from './modules/project/project.module';
import { join } from 'path';
import { RoleModule } from './modules/role/role.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { EmailTemplateModule } from './modules/email-template/email-template.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { FirebaseAdminModule } from './plugins/firebase-admin/firebase-admin.module';
import { FirebaseModule } from './plugins/firebase/firebase.module';
import { MailgunModule } from './plugins/mailgun/mailgun.module';

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
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          sortSchema: true,
          introspection: true,
          installSubscriptionHandlers: true,
          playground:
            configService.get<string>('config.environment') === 'development',
          formatError: (error) => {
            console.error(error);
            return error;
          },
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
          logging: configService.get<string>('config.database.log') === 'yes',
        };
      },
    }),

    CompanyModule,

    ProjectModule,

    RoleModule,

    ApiKeyModule,

    EmailTemplateModule,

    UserModule,

    CommonModule,

    FirebaseAdminModule,

    FirebaseModule,

    MailgunModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
