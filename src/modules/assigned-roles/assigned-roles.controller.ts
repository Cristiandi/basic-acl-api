import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { AssignedRolesService } from './assigned-roles.service';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';
import { FindAllAssignedRolesParamInput } from './dto/find-all-assigned-roles-param-input.dto';
import { FindAllAssignedRolesQueryInput } from './dto/find-alll-assigned-roles-query-input.dto';
import { FindOneAssignedRoleInput } from './dto/find-one-assigned-role-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('assigned-roles')
export class AssignedRolesController {
  constructor (private readonly assignedRolesService: AssignedRolesService) {}

  @Post()
  create(@Body() createAssignedRoleInput: CreateAssignedRoleInput): Promise<any> {
    return this.assignedRolesService.create(createAssignedRoleInput);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllAssignedRolesParamInput: FindAllAssignedRolesParamInput,
    @Query() findAllAssignedRolesQueryInput: FindAllAssignedRolesQueryInput
    ): Promise<any> {
    return this.assignedRolesService.findAll(findAllAssignedRolesParamInput, findAllAssignedRolesQueryInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOneAssignedRoleInput: FindOneAssignedRoleInput): Promise<any> {
    return this.assignedRolesService.remove(findOneAssignedRoleInput);
  }
}
