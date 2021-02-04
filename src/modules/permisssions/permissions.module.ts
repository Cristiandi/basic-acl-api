import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forFeature([Permission]),
    RolesModule,
    HttpRoutesModule,
    ProjectsModule,
    UsersModule,
    GraphqlActionsModule
  ],
  providers: [PermissionsService],
  controllers: [PermisssionsController],
  exports: [PermissionsService]
})
export class PermissionsModule {}
