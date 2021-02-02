import { Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { GraphqlActionsService } from './graphql-actions.service';

import { CreateInput } from './dto/create-input.dto';
import { ListParamInput } from './dto/list-param-input.dto';
import { ListQueryInput } from './dto/list-query-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { UpdateInput } from './dto/update-input.dto';

@Controller('graphql-actions')
export class GraphqlActionsController {
  constructor(private readonly service: GraphqlActionsService) {}

  @Post()
  public create(createInput: CreateInput): Promise<any> {
    return this.service.create(createInput);
  }

  @Get(':companyUuid')
  public list(@Param() listParamInput: ListParamInput, @Query() listQueryInput: ListQueryInput): Promise<any> {
    return this.service.list(listParamInput, listQueryInput);
  }

  @Patch(':companyUuid/:id')
  public update(findOne: FindOneInput, updateInput: UpdateInput): Promise<any> {
    return this.service.update(findOne, updateInput);
  }

  public delete(findOne: any) {
    return 'ok';
  }
}
