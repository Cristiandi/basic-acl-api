import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { HttpRoute } from './http-route.entity';

import { HttpRoutesService } from './http-routes.service';

import { CreateHttpRouteInput } from './dto/create-http-route-input.dto';
import { FindAllHttpRoutesParamInput } from './dto/find-all-http-routes-param-input.dto';
import { FindAllHttpRoutesQueryInput } from './dto/find-all-http-routes-query-input-dto';
import { UpdateHttpRouteInput } from './dto/update-http-route-input.dto';
import { FindOneHttpRouteInput } from './dto/find-one-http-route-input.dto';

@ApiTags('http-routes')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('http-routes')
export class HttpRoutesController {
  constructor(private readonly httpRoutesService: HttpRoutesService) {}

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: HttpRoute
  })
  @Post()
  create (@Body() createHttpRouteInput: CreateHttpRouteInput): Promise<HttpRoute> {
    return this.httpRoutesService.create(createHttpRouteInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [HttpRoute]
  })
  @Get(':companyUuid')
  findAll (
    @Param() findAllHttpRoutesParamInput: FindAllHttpRoutesParamInput,
    @Query() findAllHttpRoutesQueryInput: FindAllHttpRoutesQueryInput
  ): Promise<HttpRoute[]> {
    return this.httpRoutesService.findAll(findAllHttpRoutesParamInput, findAllHttpRoutesQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: HttpRoute
  })
  @Patch(':companyUuid/:id')
  update (
    @Param() findOneHttpRouteInput: FindOneHttpRouteInput,
    @Body() updateHttpRouteInput: UpdateHttpRouteInput
  ): Promise<HttpRoute> {
    return this.httpRoutesService.update(findOneHttpRouteInput, updateHttpRouteInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: HttpRoute
  })
  @Delete(':companyUuid/:id')
  remove (@Param() findOneHttpRouteInput: FindOneHttpRouteInput): Promise<HttpRoute> {
    return this.httpRoutesService.remove(findOneHttpRouteInput);
  }
}
