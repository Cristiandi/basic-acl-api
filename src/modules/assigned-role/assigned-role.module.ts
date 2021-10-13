import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignedRoleService } from './assigned-role.service';
import { AssignedRoleResolver } from './assigned-role.resolver';

import { AssignedRole } from './assigned-role.entity';

import { AssignedRoleLoaders } from './assigned-role.loaders';

import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignedRole]),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  providers: [AssignedRoleService, AssignedRoleLoaders, AssignedRoleResolver],
  exports: [AssignedRoleService],
})
export class AssignedRoleModule {}
