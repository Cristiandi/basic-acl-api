import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AssignedRole } from './assigned-role.entity';

import { AssignedRolesService } from './assigned-roles.service';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';
import { FindAllAssignedRolesParamInput } from './dto/find-all-assigned-roles-param-input.dto';
import { FindAllAssignedRolesQueryInput } from './dto/find-alll-assigned-roles-query-input.dto';
import { FindOneAssignedRoleInput } from './dto/find-one-assigned-role-input.dto';

@ApiTags('assigned-roles')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('assigned-roles')
export class AssignedRolesController {
  constructor (private readonly assignedRolesService: AssignedRolesService) {}
  
  @ApiResponse({
    status: 200,
    description: 'the created item.',
    type: AssignedRole
  })
  @Post()
  create(@Body() createAssignedRoleInput: CreateAssignedRoleInput): Promise<AssignedRole> {
    return this.assignedRolesService.create(createAssignedRoleInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [AssignedRole]
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllAssignedRolesParamInput: FindAllAssignedRolesParamInput,
    @Query() findAllAssignedRolesQueryInput: FindAllAssignedRolesQueryInput
    ): Promise<AssignedRole[]> {
    return this.assignedRolesService.findAll(findAllAssignedRolesParamInput, findAllAssignedRolesQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: AssignedRole
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOneAssignedRoleInput: FindOneAssignedRoleInput): Promise<any> {
    return this.assignedRolesService.remove(findOneAssignedRoleInput);
  }
}
