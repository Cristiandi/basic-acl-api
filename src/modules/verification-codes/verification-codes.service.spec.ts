import { Test, TestingModule } from '@nestjs/testing';
import { VerificationCodesService } from './verification-codes.service';

describe('VerificationCodesService', () => {
  let service: VerificationCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationCodesService]
    }).compile();

    service = module.get<VerificationCodesService>(VerificationCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
