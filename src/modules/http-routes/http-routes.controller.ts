import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { HttpRoutesService } from './http-routes.service';

import { CreateHttpRouteInput } from './dto/create-http-route-input.dto';
import { FindAllHttpRoutesParamInput } from './dto/find-all-http-routes-param-input.dto';
import { FindAllHttpRoutesQueryInput } from './dto/find-all-http-routes-query-input-dto';
import { UpdateHttpRouteInput } from './dto/update-http-route-input.dto';
import { FindOneHttpRouteInput } from './dto/find-one-http-route-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('http-routes')
export class HttpRoutesController {
  constructor(private readonly httpRoutesService: HttpRoutesService) {}

  @Post()
  create (@Body() createHttpRouteInput: CreateHttpRouteInput): Promise<any> {
    return this.httpRoutesService.create(createHttpRouteInput);
  }

  @Get(':companyUuid')
  findAll (
    @Param() findAllHttpRoutesParamInput: FindAllHttpRoutesParamInput,
    @Query() findAllHttpRoutesQueryInput: FindAllHttpRoutesQueryInput
  ): Promise<any> {
    return this.httpRoutesService.findAll(findAllHttpRoutesParamInput, findAllHttpRoutesQueryInput);
  }

  @Patch(':companyUuid/:id')
  update (
    @Param() findOneHttpRouteInput: FindOneHttpRouteInput,
    @Body() updateHttpRouteInput: UpdateHttpRouteInput
  ): Promise<any> {
    return this.httpRoutesService.update(findOneHttpRouteInput, updateHttpRouteInput);
  }

  @Delete(':companyUuid/:id')
  remove (@Param() findOneHttpRouteInput: FindOneHttpRouteInput): Promise<any> {
    return this.httpRoutesService.remove(findOneHttpRouteInput);
  }
}
