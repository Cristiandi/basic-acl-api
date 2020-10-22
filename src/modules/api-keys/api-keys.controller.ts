import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ApiKey } from './api-key.entity';

import { ApiKeysService } from './api-keys.service';

import { CreateApiKeyInput } from './dto/create-api-key-input.dto';
import { FindAllApiKeysParamInput } from './dto/find-all-api-keys-param-input.dto';
import { FindAllApiKeysQueryInput } from './dto/find-all-api-keys-query-input.dto';
import { FindOneApiKeyInput } from './dto/find-one-api-key-input.dto';
import { UpdateApiKeyInput } from './dto/update-api-key-input.dto';

@ApiTags('api-keys')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @ApiResponse({
    status: 200,
    description: 'the created item.',
    type: ApiKey
  })
  @Post()
  create(@Body() createApiKeyInput: CreateApiKeyInput): Promise<ApiKey> {
    return this.apiKeysService.create(createApiKeyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the items.',
    type: [ApiKey]
  })
  @Get(':companyUuid')
  findAll(
    @Param() findAllApiKeysParamInput: FindAllApiKeysParamInput,
    @Query() findAllApiKeysQueryInput: FindAllApiKeysQueryInput
  ): Promise<ApiKey[]> {
    return this.apiKeysService.findAll(findAllApiKeysParamInput, findAllApiKeysQueryInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ApiKey
  })
  @Patch(':companyUuid/:id')
  update(
    @Param() findOneApiKeyInput: FindOneApiKeyInput,
    @Body() updateApiKeyInput: UpdateApiKeyInput
  ): Promise<ApiKey> {
    return this.apiKeysService.update(findOneApiKeyInput, updateApiKeyInput);
  }

  @ApiResponse({
    status: 200,
    description: 'the item.',
    type: ApiKey
  })
  @Delete(':companyUuid/:id')
  remove(@Param() findOneApiKeyInput: FindOneApiKeyInput): Promise<ApiKey> {
    return this.apiKeysService.remove(findOneApiKeyInput);
  }
}
