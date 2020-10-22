import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PermissionsService } from './permissions.service';

import { Public } from 'src/common/decorators/public.decorator';

import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { FindAllPermissionsParamInput } from './dto/find-all-permissions-param-input.dto';
import { FindAllPermissionsQueryInput } from './dto/find-all-permissions-query-input.dto';
import { FindOnePermissionInput } from './dto/find-one-permission-input.dto';
import { UpdatePermissionInput } from './dto/update-permission-input.dto';
import { HitsWatcher } from 'src/common/decorators/hits-watcher.decorator';

@ApiTags('permissions')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('permissions')
export class PermisssionsController {
  constructor (private  readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionInput: CreatePermissionInput): Promise<any> {
    return this.permissionsService.create(createPermissionInput);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllPermissionsParamInput: FindAllPermissionsParamInput,
    @Query() findAllPermissionsQueryInput: FindAllPermissionsQueryInput
  ): Promise<any> {
    return this.permissionsService.findAll(findAllPermissionsParamInput, findAllPermissionsQueryInput);
  }

  @Patch(':companyUuid/:id')
  update(
    @Param() findOnePermissionInput: FindOnePermissionInput,
    @Body() updatePermissionInput: UpdatePermissionInput
  ): Promise<any> {
    return this.permissionsService.update(findOnePermissionInput, updatePermissionInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOnePermissionInput: FindOnePermissionInput): Promise<any> {
    return this.permissionsService.remove(findOnePermissionInput);
  }

  @HitsWatcher(10, 60)
  @Public()
  @Post('/check')
  check(@Body() checkPermissionInput: CheckPermissionInput): Promise<any> {
    return this.permissionsService.checkPermission(checkPermissionInput);
  }
}
