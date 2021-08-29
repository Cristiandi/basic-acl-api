import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './role.entity';

import { RoleService } from './role.service';
import { RoleLoaders } from './role.loaders';
import { RoleResolver } from './role.resolver';

import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), CompanyModule],
  providers: [RoleService, RoleLoaders, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}
