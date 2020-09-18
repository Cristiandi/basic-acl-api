import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './api-key.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    CompaniesModule
  ],
  providers: [ApiKeysService],
  controllers: [ApiKeysController],
  exports: [ApiKeysService]
})
export class ApiKeysModule {}
