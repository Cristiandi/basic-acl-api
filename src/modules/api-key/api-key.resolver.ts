import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { ApiKey } from './api-key.entity';
import { Company } from '../company/company.entity';

import { ApiKeyService } from './api-key.service';
import { ApiKeyLoaders } from './api-key.loaders';
import { CreateApiKeyInput } from './dto/create-api-key-input.dto';
import { GetOneApiKeyInput } from './dto/get-one-api-key-input.dto';
import { GetAllApiKeysInput } from './dto/get-all-api-key-input.dto';
import { UpdateApiKeyInput } from './dto/update-api-key-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => ApiKey)
export class ApiKeyResolver {
  constructor(
    readonly service: ApiKeyService,
    readonly loaders: ApiKeyLoaders,
  ) {}

  @Mutation(() => ApiKey, { name: 'createApiKey' })
  public create(
    @Args('createApiKeyInput') input: CreateApiKeyInput,
  ): Promise<ApiKey> {
    return this.service.create(input);
  }

  @Query(() => ApiKey, { name: 'getOneApiKey', nullable: true })
  public getOne(
    @Args('getOneApiKeyInput') input: GetOneApiKeyInput,
  ): Promise<ApiKey | undefined> {
    return this.service.getOne(input);
  }

  @Query(() => [ApiKey], { name: 'getAllApiKeys' })
  public getAll(
    @Args('getAllApiKeysInput') input: GetAllApiKeysInput,
  ): Promise<ApiKey[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => ApiKey, { name: 'updateApiKey' })
  public update(
    @Args('getOneApiKeyInput') getOneApiKeyInput: GetOneApiKeyInput,
    @Args('updateApiKeyInput') input: UpdateApiKeyInput,
  ): Promise<ApiKey> {
    return this.service.update(getOneApiKeyInput, input);
  }

  @Mutation(() => ApiKey, { name: 'deleteApiKey' })
  public delete(
    @Args('getOneApiKeyInput') input: GetOneApiKeyInput,
  ): Promise<ApiKey> {
    return this.service.delete(input);
  }

  @ResolveField(() => Company, { name: 'company' })
  company(@Parent() apiKey: ApiKey): Promise<Company> {
    const value: any = apiKey.company;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCompanies.load(id);
  }
}
