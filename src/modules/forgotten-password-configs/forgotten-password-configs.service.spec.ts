import { Test, TestingModule } from '@nestjs/testing';
import { ForgottenPasswordConfigsService } from './forgotten-password-configs.service';

describe('ForgottenPasswordConfigsService', () => {
  let service: ForgottenPasswordConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgottenPasswordConfigsService]
    }).compile();

    service = module.get<ForgottenPasswordConfigsService>(ForgottenPasswordConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
