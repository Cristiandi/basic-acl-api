import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


import { AppController } from './app.controller';
import { AppService } from './app.service';


import { CommonModule } from './common/common.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { RolesModule } from './modules/roles/roles.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { AssignedRolesModule } from './modules/assigned-roles/assigned-roles.module';
import { HttpRoutesModule } from './modules/http-routes/http-routes.module';
import { PermissionsModule } from './modules/permisssions/permissions.module';
import { VerificationCodesModule } from './modules/verification-codes/verification-codes.module';
import { ConfirmationEmailConfigsModule } from './modules/confirmation-email-configs/confirmation-email-configs.module';
import { ParametersModule } from './modules/parameters/parameters.module';
import { ForgottenPasswordConfigsModule } from './modules/forgotten-password-configs/forgotten-password-configs.module';
import { GraphqlActionsModule } from './modules/graphql-actions/graphql-actions.module';

import appConfig from './config/app.config';
import appConfigSchema from './config/app.config.schema';

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
        synchronize: process.env.NODE_ENV !== 'production',
        logging: true
      })
    }),
    CommonModule,
    CompaniesModule,
    UsersModule,
    ProjectsModule,
    RolesModule,
    ApiKeysModule,
    AssignedRolesModule,
    HttpRoutesModule,
    PermissionsModule,
    VerificationCodesModule,
    ConfirmationEmailConfigsModule,
    ParametersModule,
    ForgottenPasswordConfigsModule,
    GraphqlActionsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
