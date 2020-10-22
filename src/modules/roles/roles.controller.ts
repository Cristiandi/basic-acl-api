import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesService } from './roles.service';

import { CreateRoleInput } from './dto/create-role-input.dto';
import { FindAllRolesParamInput } from './dto/find-all-roles-param-input.dto';
import { FindAllRolesQueryInput } from './dto/find-all-roles-query-input.dto';
import { FindOneRoleInput } from './dto/find-one-role-input.dto';
import { UpdateRoleInput } from './dto/update-role-input.dto';

@ApiTags('roles')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    create(@Body() createRoleInput: CreateRoleInput): Promise<any> {
        return this.rolesService.create(createRoleInput);
    }

    @Get(':companyUuid')
    findAll(
        @Param() findAllRolesParamInput: FindAllRolesParamInput,
        @Query() findAllRolesQueryInput: FindAllRolesQueryInput
    ): Promise<any> {
        return this.rolesService.findAll(findAllRolesParamInput, findAllRolesQueryInput);
    }

    @Patch(':companyUuid/:id')
    update(
        @Param() findOneRoleInput: FindOneRoleInput,
        @Body() updateRoleInput: UpdateRoleInput
    ): Promise<any> {
        return this.rolesService.update(findOneRoleInput, updateRoleInput);
    }

    @Delete(':companyUuid/:id')
    remove(@Param() findOneRoleInput: FindOneRoleInput): Promise<any> {
        return this.rolesService.remove(findOneRoleInput);
    }
}
