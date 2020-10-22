import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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

    @Post()
    create(@Body() createProjectInput: CreateProjectInput): Promise<any> {
        return this.projectsService.create(createProjectInput);
    }

    @Get(':companyUuid')
    findAll(
        @Param() findAllProjectsParamInput: FindAllProjectsParamInput,
        @Query() FindAllProjectsQueryInput: FindAllProjectsQueryInput
    ): Promise<any>  {
        return this.projectsService.findAll(findAllProjectsParamInput, FindAllProjectsQueryInput);
    }

    @Patch(':companyUuid/:id')
    update(
        @Param() findOneProjectInput: FindOneProjectInput,
        @Body() updateProjectInput: UpdateProjectInput
    ): Promise<any> {
        return this.projectsService.update(findOneProjectInput, updateProjectInput);
    }

    @Delete(':companyUuid/:id')
    remove(@Param() findOneProjectInput: FindOneProjectInput): Promise<any> {
        return this.projectsService.remove(findOneProjectInput);
    }
}
