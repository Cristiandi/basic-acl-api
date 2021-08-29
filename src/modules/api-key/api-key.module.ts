import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKey } from './api-key.entity';

import { ApiKeyService } from './api-key.service';
import { ApiKeyLoaders } from './api-key.loaders';
import { ApiKeyResolver } from './api-key.resolver';

import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey]), CompanyModule],
  providers: [ApiKeyService, ApiKeyLoaders, ApiKeyResolver],
  exports: [ApiKeyService],
})
export class ApiKeyModule {}
