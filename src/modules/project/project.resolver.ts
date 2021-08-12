import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Project } from './project.entity';

import { ProjectService } from './project.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver()
export class ProjectResolver {
  constructor(private readonly service: ProjectService) {}

  @Mutation(() => Project, { name: 'createProject' })
  public create(
    @Args('createProjectInput') input: CreateProjectInput,
  ): Promise<Project> {
    return this.service.create(input);
  }
}
