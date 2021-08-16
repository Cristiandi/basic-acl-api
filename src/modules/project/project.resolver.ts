import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Project } from './project.entity';
import { Company } from '../company/company.entity';

import { ProjectService } from './project.service';
import { ProjectLoaders } from './project.loaders';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { GetOneProjectInput } from './dto/get-one-project-input.dto';
import { GetAllProjectsInput } from './dto/get-all-projects-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly service: ProjectService,
    private readonly loaders: ProjectLoaders,
  ) {}

  @Mutation(() => Project, { name: 'createProject' })
  public create(
    @Args('createProjectInput') input: CreateProjectInput,
  ): Promise<Project> {
    return this.service.create(input);
  }

  @Query(() => Project, { name: 'getOneProject', nullable: true })
  public getOne(
    @Args('getOneProjectInput') input: GetOneProjectInput,
  ): Promise<Project | undefined> {
    return this.service.getOne(input);
  }

  @Query(() => [Project], { name: 'getAllProjects', nullable: true })
  public getAll(
    @Args('getProjectsInput') input: GetAllProjectsInput,
  ): Promise<Project[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Project, { name: 'updateProject' })
  public update(
    @Args('getOneProjectInput') getOneProjectInput: GetOneProjectInput,
    @Args('updateProjectInput') input: UpdateProjectInput,
  ): Promise<Project> {
    return this.service.update(getOneProjectInput, input);
  }

  @Mutation(() => Project, { name: 'deleteProject' })
  public delete(
    @Args('getOneProjectInput') input: GetOneProjectInput,
  ): Promise<Project> {
    return this.service.delete(input);
  }

  @ResolveField(() => Company, { name: 'company' })
  company(@Parent() project: Project): Promise<Company> {
    const value: any = project.company;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCompanies.load(id);
  }
}
