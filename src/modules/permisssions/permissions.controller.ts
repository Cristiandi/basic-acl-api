import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Permission } from './permission.entity';

import { PermissionsService } from './permissions.service';

import { Public } from 'src/common/decorators/public.decorator';
import { HitsWatcher } from 'src/common/decorators/hits-watcher.decorator';

import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { FindAllPermissionsParamInput } from './dto/find-all-permissions-param-input.dto';
import { FindAllPermissionsQueryInput } from './dto/find-all-permissions-query-input.dto';
import { FindOnePermissionInput } from './dto/find-one-permission-input.dto';
import { UpdatePermissionInput } from './dto/update-permission-input.dto';
import { CheckPermissionOutput } from './dto/check-permission-output.dto';

@ApiTags('permissions')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('permissions')
export class PermisssionsController {
  constructor (private  readonly permissionsService: PermissionsService) {}

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: Permission
  })
  @Post()
  create(@Body() createPermissionInput: CreatePermissionInput): Promise<Permission> {
    return this.permissionsService.create(createPermissionInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [Permission]
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllPermissionsParamInput: FindAllPermissionsParamInput,
    @Query() findAllPermissionsQueryInput: FindAllPermissionsQueryInput
  ): Promise<Permission[]> {
    return this.permissionsService.findAll(findAllPermissionsParamInput, findAllPermissionsQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items',
    type: [Permission]
  })
  @Patch(':companyUuid/:id')
  update(
    @Param() findOnePermissionInput: FindOnePermissionInput,
    @Body() updatePermissionInput: UpdatePermissionInput
  ): Promise<Permission> {
    return this.permissionsService.update(findOnePermissionInput, updatePermissionInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item',
    type: Permission
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOnePermissionInput: FindOnePermissionInput): Promise<Permission> {
    return this.permissionsService.remove(findOnePermissionInput);
  }

  @ApiResponse({
    status: 200,
    description: 'object',
    type: CheckPermissionOutput
  })
  @HitsWatcher(10, 60)
  @Public()
  @Post('/check')
  check(@Body() checkPermissionInput: CheckPermissionInput): Promise<CheckPermissionOutput> {
    return this.permissionsService.checkPermission(checkPermissionInput);
  }
}
