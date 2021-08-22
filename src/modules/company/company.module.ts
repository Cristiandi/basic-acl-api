import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './company.entity';

import { CompanyService } from './services/company.service';
import { CompanyExtraService } from './services/company-extra.service';
import { CompanyResolver } from './company.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyService, CompanyExtraService, CompanyResolver],
  exports: [CompanyService, CompanyExtraService],
})
export class CompanyModule {}
