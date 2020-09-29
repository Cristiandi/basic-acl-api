import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmationEmailConfig } from './confirmation-email-config.entity';

@Injectable()
export class ConfirmationEmailConfigsService {
  constructor(
    @InjectRepository(ConfirmationEmailConfig)
    private readonly confirmationEmailConfigRepository: Repository<ConfirmationEmailConfig>
  ) {}
}
