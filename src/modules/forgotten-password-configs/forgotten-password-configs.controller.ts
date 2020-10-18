import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { ForgottenPasswordConfigsService } from './forgotten-password-configs.service';

import { CreateInput } from './dto/create-input.dto';
import { FindAllParamInput } from './dto/find-all-param-input.dto';
import { FindAllQueryInput } from './dto/find-alll-query-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { UpdateInput } from './dto/update-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('forgotten-password-configs')
export class ForgottenPasswordConfigsController {
  constructor(private readonly forgottenPasswordConfigsService: ForgottenPasswordConfigsService) {}

  @Post()
  create(@Body() createInput: CreateInput): Promise<any> {
    return this.forgottenPasswordConfigsService.create(createInput);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllParamInput: FindAllParamInput,
    @Query() findAllQueryInput: FindAllQueryInput
  ): Promise<any> {
    return this.forgottenPasswordConfigsService.findAll(findAllParamInput, findAllQueryInput);
  }

  @Patch(':companyUuid/:id')
  update(
    @Param() findOneInput: FindOneInput,
    @Body() updateInput: UpdateInput 
  ): Promise<any> {
    return this.forgottenPasswordConfigsService.update(findOneInput, updateInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOneInput: FindOneInput): Promise<any> {
    return this.forgottenPasswordConfigsService.remove(findOneInput);
  }
}
