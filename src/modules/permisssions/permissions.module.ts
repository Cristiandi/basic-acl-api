import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';

import appConfig from '../../config/app.config';

import { Permission } from './permission.entity';

import { PermissionsService } from './permissions.service';

import { PermisssionsController } from './permissions.controller';

import { RolesModule } from '../roles/roles.module';
import { HttpRoutesModule } from '../http-routes/http-routes.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { GraphqlActionsModule } from '../graphql-actions/graphql-actions.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([Permission]),
    RolesModule,
    HttpRoutesModule,
    ProjectsModule,
    UsersModule,
    GraphqlActionsModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        name: process.env.REDIS_CLIENT_NAME
      })
    })
  ],
  providers: [PermissionsService],
  controllers: [PermisssionsController],
  exports: [PermissionsService]
})
export class PermissionsModule {}
