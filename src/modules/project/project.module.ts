import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';

import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), CompanyModule],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule {}
