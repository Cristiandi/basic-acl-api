import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationEmailConfigsService } from './confirmation-email-configs.service';

describe('ConfirmationEmailConfigsService', () => {
  let service: ConfirmationEmailConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfirmationEmailConfigsService]
    }).compile();

    service = module.get<ConfirmationEmailConfigsService>(ConfirmationEmailConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
