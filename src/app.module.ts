import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import appConfig from './config/app.config';
import ormConfig from './config/orm.config';

// import { loggerMiddleware } from './common/middlewares/logger.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

import { CompanyModule } from './modules/company/company.module';
import { RoleModule } from './modules/role/role.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { EmailTemplateModule } from './modules/email-template/email-template.module';
import { UserModule } from './modules/user/user.module';
import { CommonModule } from './common/common.module';
import { FirebaseAdminModule } from './plugins/firebase-admin/firebase-admin.module';
import { FirebaseModule } from './plugins/firebase/firebase.module';
import { MailgunModule } from './plugins/mailgun/mailgun.module';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { AssignedRoleModule } from './modules/assigned-role/assigned-role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RedisCacheModule } from './plugins/redis-cache/redis-cache.module';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      introspection: true,
      installSubscriptionHandlers: true,
      playground: process.env.NODE_ENV === 'development',
      formatError: (error) => {
        console.error(error);
        return error;
      },
      driver: ApolloDriver,
      persistedQueries: false, // this is to prevent denial of service attacks
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...ormConfig,
          logging: configService.get<string>('config.database.log') === 'yes',
        };
      },
    }),

    CompanyModule,

    RoleModule,

    ApiKeyModule,

    EmailTemplateModule,

    UserModule,

    CommonModule,

    FirebaseAdminModule,

    FirebaseModule,

    MailgunModule,

    VerificationCodeModule,

    AssignedRoleModule,

    PermissionModule,

    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
