import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';

import { Permission } from './permission.entity';

import { ProjectModule } from '../project/project.module';
import { RoleModule } from '../role/role.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    ProjectModule,
    RoleModule,
    ApiKeyModule,
  ],
  providers: [PermissionService, PermissionResolver],
  exports: [PermissionService],
})
export class PermissionModule {}
