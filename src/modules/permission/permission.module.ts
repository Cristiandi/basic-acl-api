import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionService } from './services/permission.service';
import { PermissionLoaders } from './permission.loaders';
import { PermissionResolver } from './permission.resolver';

import { Permission } from './permission.entity';

import { RoleModule } from '../role/role.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { UserModule } from '../user/user.module';
import { AssignedRoleModule } from '../assigned-role/assigned-role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    RoleModule,
    ApiKeyModule,
    UserModule,
    AssignedRoleModule,
  ],
  providers: [PermissionService, PermissionLoaders, PermissionResolver],
  exports: [PermissionService],
})
export class PermissionModule {}
