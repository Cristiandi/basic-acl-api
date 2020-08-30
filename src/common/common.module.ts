import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { ApiKeyGuard } from './guards/api-key.guard';

import appConfig from 'src/config/app.config';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }]
})
export class CommonModule {}
