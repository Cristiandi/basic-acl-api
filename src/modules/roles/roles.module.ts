import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';

import { Role } from './role.entity';

import { RolesController } from './roles.controller';

import { RolesService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    CompaniesModule
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
