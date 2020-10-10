import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

import { VerificationCode } from './verification-code.entity';

import { CreateVerificationCodeInput } from './dto/create-verification-code-input.dto';
import { ValidVerificationCode } from './dto/valid-verification-code-input.dto';
import { FindOneVerificationCode } from './dto/find-one-verification-code-input.dto';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>
  ) {}

  public async create(createVerificationCodeInput: CreateVerificationCodeInput): Promise<VerificationCode | null> {
    const { expirationDate, type, email } = createVerificationCodeInput;

    const created = this.verificationCodeRepository.create({
      code: nanoid(10),
      expirationDate,
      type,
      email
    });

    return this.verificationCodeRepository.save(created);
  }

  public async findOne(findOneVerificationCode: FindOneVerificationCode): Promise<VerificationCode> {
    const { code } = findOneVerificationCode;

    const existing = await this.verificationCodeRepository.createQueryBuilder('vc')
      .where('vc.code = :code', { code })
      .getOne();

    return existing || null;
  }

  public async valid(validVerificationCode: ValidVerificationCode): Promise<boolean> {
    const { code } = validVerificationCode;

    const existing = await this.findOne({ code });

    if (!existing) {
      throw new NotFoundException(`can't ger the verification code with code ${code}.`);
    }

    const { expirationDate } = existing;

    const currentDate = new Date();

    return expirationDate.getTime() > currentDate.getTime();
  }
}
