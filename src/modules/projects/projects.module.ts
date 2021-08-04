import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './project.entity';

import { CompaniesModule } from '../companies/companies.module';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    CompaniesModule
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService]
})
export class ProjectsModule {}
