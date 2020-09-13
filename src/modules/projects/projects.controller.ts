import { Body, Controller, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ProjectsService } from './projects.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { FindAllProjectsParamInput } from './dto/find-all-projects-param-input.dto';
import { FindAllProjectsQueryInput } from './dto/find-all-projects-query-input.dto';

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
}
