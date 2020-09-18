import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyInput } from './dto/create-api-key-input.dto';
import { FindAllApiKeysParamInput } from './dto/find-all-api-keys-param-input.dto';
import { FindAllApiKeysQueryInput } from './dto/find-all-api-keys-query-input.dto';
import { FindOneApiKeyInput } from './dto/find-one-api-key-input.dto';
import { UpdateApiKeyInput } from './dto/update-api-key-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Body() createApiKeyInput: CreateApiKeyInput): Promise<any> {
    return this.apiKeysService.create(createApiKeyInput);
  }

  @Get(':companyUuid')
  findAll(
    @Param() findAllApiKeysParamInput: FindAllApiKeysParamInput,
    @Query() findAllApiKeysQueryInput: FindAllApiKeysQueryInput
  ): Promise<any> {
    return this.apiKeysService.findAll(findAllApiKeysParamInput, findAllApiKeysQueryInput);
  }

  @Patch(':companyUuid/:id')
  update(
    @Param() findOneApiKeyInput: FindOneApiKeyInput,
    @Body() updateApiKeyInput: UpdateApiKeyInput
  ): Promise<any> {
    return this.apiKeysService.update(findOneApiKeyInput, updateApiKeyInput);
  }

  @Delete(':companyUuid/:id')
  remove(@Param() findOneApiKeyInput: FindOneApiKeyInput): Promise<any> {
    return this.apiKeysService.remove(findOneApiKeyInput);
  }
}
