import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionService } from './services/permission.service';
import { PermissionLoaders } from './permission.loaders';
import { PermissionResolver } from './permission.resolver';

import { Permission } from './permission.entity';

import { RoleModule } from '../role/role.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RoleModule, ApiKeyModule],
  providers: [PermissionService, PermissionLoaders, PermissionResolver],
  exports: [PermissionService],
})
export class PermissionModule {}
