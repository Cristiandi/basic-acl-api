import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CompanyModule } from 'src/modules/company/company.module';

import appConfig from '../config/app.config';

import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [ConfigModule.forFeature(appConfig), CompanyModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class CommonModule {}
