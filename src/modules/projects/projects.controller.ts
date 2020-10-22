import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { FindAllProjectsParamInput } from './dto/find-all-projects-param-input.dto';
import { FindAllProjectsQueryInput } from './dto/find-all-projects-query-input.dto';
import { FindOneProjectInput } from './dto/find-one-project-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';

@ApiTags('projects')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Project
      })
    @Post()
    create(@Body() createProjectInput: CreateProjectInput): Promise<Project> {
        return this.projectsService.create(createProjectInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the items.',
        type: [Project]
      })
    @Get(':companyUuid')
    findAll(
        @Param() findAllProjectsParamInput: FindAllProjectsParamInput,
        @Query() FindAllProjectsQueryInput: FindAllProjectsQueryInput
    ): Promise<Project[]>  {
        return this.projectsService.findAll(findAllProjectsParamInput, FindAllProjectsQueryInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Project
      })
    @Patch(':companyUuid/:id')
    update(
        @Param() findOneProjectInput: FindOneProjectInput,
        @Body() updateProjectInput: UpdateProjectInput
    ): Promise<Project> {
        return this.projectsService.update(findOneProjectInput, updateProjectInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Project
      })
    @Delete(':companyUuid/:id')
    remove(@Param() findOneProjectInput: FindOneProjectInput): Promise<Project> {
        return this.projectsService.remove(findOneProjectInput);
    }
}
