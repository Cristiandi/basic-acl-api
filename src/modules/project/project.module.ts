import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';

import { ProjectService } from './project.service';
import { ProjectLoaders } from './project.loaders';
import { ProjectResolver } from './project.resolver';

import { CompanyModule } from '../company/company.module';
@Module({
  imports: [TypeOrmModule.forFeature([Project]), CompanyModule],
  providers: [ProjectService, ProjectLoaders, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
