import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationCode } from './verification-code.entity';

import { VerificationCodesService } from './verification-codes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCode])
  ],
  providers: [VerificationCodesService],
  exports: [VerificationCodesService]
})
export class VerificationCodesModule {}
