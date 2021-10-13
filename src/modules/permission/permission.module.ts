import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionService } from './services/permission.service';
import { PermissionLoaders } from './permission.loaders';
import { PermissionResolver } from './resolvers/permission.resolver';
import { PermissionExtraService } from './services/permission-extra.service';
import { PermissionExtraResolver } from './resolvers/permission-extra.resolver';

import { Permission } from './permission.entity';

import { RoleModule } from '../role/role.module';
import { ApiKeyModule } from '../api-key/api-key.module';
import { UserModule } from '../user/user.module';
import { AssignedRoleModule } from '../assigned-role/assigned-role.module';
import { CompanyModule } from '../company/company.module';
import { FirebaseAdminModule } from 'src/plugins/firebase-admin/firebase-admin.module';
import { RedisCacheModule } from 'src/plugins/redis-cache/redis-cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    RoleModule,
    ApiKeyModule,
    CompanyModule,
    FirebaseAdminModule,
    UserModule,
    AssignedRoleModule,
    RedisCacheModule,
  ],
  providers: [
    PermissionService,
    PermissionExtraService,
    PermissionLoaders,
    PermissionResolver,
    PermissionExtraResolver,
  ],
  exports: [PermissionService, PermissionExtraService],
})
export class PermissionModule {}
