import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../../config/app.config';

import { MailgunService } from './mailgun.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [MailgunService],
  exports: [MailgunService]
})
export class MailgunModule {}
