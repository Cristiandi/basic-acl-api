import { Module } from '@nestjs/common';
import { AssignedRoleService } from './assigned-role.service';
import { AssignedRoleResolver } from './assigned-role.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignedRole } from './assigned-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssignedRole])],
  providers: [AssignedRoleService, AssignedRoleResolver],
  exports: [AssignedRoleService],
})
export class AssignedRoleModule {}
