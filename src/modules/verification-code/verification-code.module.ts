import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationCodeService } from './verification-code.service';

import { VerificationCode } from './verfication-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode])],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
