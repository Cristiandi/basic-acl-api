import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailgunService } from './mailgun.service';

import appConfig from '../../config/app.config';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailgunModule {}
