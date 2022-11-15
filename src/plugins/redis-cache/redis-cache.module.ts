import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
