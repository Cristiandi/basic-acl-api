import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignedRole } from './assigned-role.entity';

import { AssignedRolesService } from './assigned-roles.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';

import { AssignedRolesController } from './assigned-roles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignedRole]),
    UsersModule,
    RolesModule,
    ApiKeysModule
  ],
  providers: [AssignedRolesService],
  controllers: [AssignedRolesController],
  exports: [AssignedRolesService]
})
export class AssignedRolesModule {}
