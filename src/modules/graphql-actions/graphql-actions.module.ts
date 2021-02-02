import { Module } from '@nestjs/common';
import { GraphqlActionsService } from './graphql-actions.service';
import { GraphqlActionsController } from './graphql-actions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GraphqlAction } from './graphql-action.entity';

import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GraphqlAction]),
    ProjectsModule
  ],
  providers: [GraphqlActionsService],
  controllers: [GraphqlActionsController]
})
export class GraphqlActionsModule {}
