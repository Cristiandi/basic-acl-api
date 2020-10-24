import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from './role.entity';
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
    constructor(private readonly rolesService: RolesService) { }

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Role
    })
    @Post()
    create(@Body() createRoleInput: CreateRoleInput): Promise<Role> {
        return this.rolesService.create(createRoleInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the items.',
        type: [Role]
    })
    @Get(':companyUuid')
    findAll(
        @Param() findAllRolesParamInput: FindAllRolesParamInput,
        @Query() findAllRolesQueryInput: FindAllRolesQueryInput
    ): Promise<Role[]> {
        return this.rolesService.findAll(findAllRolesParamInput, findAllRolesQueryInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Role
    })
    @Patch(':companyUuid/:id')
    update(
        @Param() findOneRoleInput: FindOneRoleInput,
        @Body() updateRoleInput: UpdateRoleInput
    ): Promise<Role> {
        return this.rolesService.update(findOneRoleInput, updateRoleInput);
    }

    @ApiResponse({
        status: 200,
        description: 'the item.',
        type: Role
    })
    @Delete(':companyUuid/:id')
    remove(@Param() findOneRoleInput: FindOneRoleInput): Promise<Role> {
        return this.rolesService.remove(findOneRoleInput);
    }
}
