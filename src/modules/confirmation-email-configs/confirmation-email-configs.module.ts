import { Module } from '@nestjs/common';
import { ConfirmationEmailConfigsService } from './confirmation-email-configs.service';
import { ConfirmationEmailConfigsController } from './confirmation-email-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfirmationEmailConfig } from './confirmation-email-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfirmationEmailConfig])
  ],
  providers: [ConfirmationEmailConfigsService],
  controllers: [ConfirmationEmailConfigsController]
})
export class ConfirmationEmailConfigsModule {}
