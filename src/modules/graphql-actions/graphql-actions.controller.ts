import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GraphqlActionsService } from './graphql-actions.service';

import { CreateInput } from './dto/create-input.dto';
import { ListParamInput } from './dto/list-param-input.dto';
import { ListQueryInput } from './dto/list-query-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { UpdateInput } from './dto/update-input.dto';

@ApiTags('graphql-actions')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('graphql-actions')
export class GraphqlActionsController {
  constructor(private readonly service: GraphqlActionsService) {}

  @Post()
  public create(@Body() createInput: CreateInput): Promise<any> {
    return this.service.create(createInput);
  }

  @Get(':companyUuid')
  public list(@Param() listParamInput: ListParamInput, @Query() listQueryInput: ListQueryInput): Promise<any> {
    return this.service.list(listParamInput, listQueryInput);
  }

  @Patch(':companyUuid/:id')
  public update(@Param() findOneInput: FindOneInput,@Body() updateInput: UpdateInput): Promise<any> {
    return this.service.update(findOneInput, updateInput);
  }

  @Delete(':companyUuid/:id')
  public delete(@Param() findOneInput: FindOneInput): Promise<any> {
    return this.service.delete(findOneInput);
  }
}
