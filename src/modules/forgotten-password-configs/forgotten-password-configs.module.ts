import { Module } from '@nestjs/common';
import { ForgottenPasswordConfigsService } from './forgotten-password-configs.service';
import { ForgottenPasswordConfigsController } from './forgotten-password-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ForgottenPasswordConfig } from './forgotten-password-config.entity';

import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForgottenPasswordConfig]),
    CompaniesModule
  ],
  providers: [ForgottenPasswordConfigsService],
  controllers: [ForgottenPasswordConfigsController],
  exports: [ForgottenPasswordConfigsService]
})
export class ForgottenPasswordConfigsModule {}
