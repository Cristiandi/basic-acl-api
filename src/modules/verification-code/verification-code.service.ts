import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { VerificationCode } from './verfication-code.entity';

import { generateUid } from '../../utils';

import { CreateVerificationCodeInput } from './dto/create-verification-code-input.dto';
import { validateVerificationCodeInput } from './dto/validate-verification-code-input.dto';
import { GetOneVerificationCodeInput } from './dto/get-one-verification-code-input.dto';

@Injectable()
export class VerificationCodeService extends BaseService<VerificationCode> {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
  ) {
    super(verificationCodeRepository);
  }

  public async create(
    input: CreateVerificationCodeInput,
  ): Promise<VerificationCode> {
    const { expirationDate, type, user } = input;

    const created = await this.verificationCodeRepository.create({
      type,
      code: generateUid(10),
      expirationDate,
      user,
    });

    const saved = await this.verificationCodeRepository.save(created);

    return saved;
  }

  public async validate(
    validVerificationCode: validateVerificationCodeInput,
  ): Promise<VerificationCode> {
    const { code } = validVerificationCode;

    const existing = await this.getOneByOneFields({
      fields: { code },
      checkIfExists: true,
      relations: ['user'],
    });

    const { expirationDate } = existing;

    const currentDate = new Date();

    if (!(expirationDate.getTime() > currentDate.getTime())) {
      throw new ConflictException(`the verification code ${code} is expired.`);
    }

    return existing;
  }

  public async delete(
    input: GetOneVerificationCodeInput,
  ): Promise<VerificationCode> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      relations: ['user'],
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.verificationCodeRepository.softRemove(existing);

    return clone as VerificationCode;
  }
}
