import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ForgottenPasswordConfig } from './forgotten-password-config.entity';

import { ForgottenPasswordConfigsService } from './forgotten-password-configs.service';

import { CreateInput } from './dto/create-input.dto';
import { FindAllParamInput } from './dto/find-all-param-input.dto';
import { FindAllQueryInput } from './dto/find-alll-query-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { UpdateInput } from './dto/update-input.dto';

@ApiTags('forgotten-password-configs')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('forgotten-password-configs')
export class ForgottenPasswordConfigsController {
  constructor(private readonly forgottenPasswordConfigsService: ForgottenPasswordConfigsService) {}

  @ApiResponse({
    status: 200,
    description: 'the created item.',
    type: ForgottenPasswordConfig
  })
  @Post()
  create(@Body() createInput: CreateInput): Promise<ForgottenPasswordConfig> {
    return this.forgottenPasswordConfigsService.create(createInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [ForgottenPasswordConfig]
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllParamInput: FindAllParamInput,
    @Query() findAllQueryInput: FindAllQueryInput
  ): Promise<ForgottenPasswordConfig[]> {
    return this.forgottenPasswordConfigsService.findAll(findAllParamInput, findAllQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ForgottenPasswordConfig
  })
  @Patch(':companyUuid/:id')
  update(
    @Param() findOneInput: FindOneInput,
    @Body() updateInput: UpdateInput 
  ): Promise<any> {
    return this.forgottenPasswordConfigsService.update(findOneInput, updateInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ForgottenPasswordConfig
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOneInput: FindOneInput): Promise<any> {
    return this.forgottenPasswordConfigsService.remove(findOneInput);
  }
}
