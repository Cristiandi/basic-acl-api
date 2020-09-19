import { Test, TestingModule } from '@nestjs/testing';
import { AssignedRolesService } from './assigned-roles.service';

describe('AssignedRolesService', () => {
  let service: AssignedRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignedRolesService]
    }).compile();

    service = module.get<AssignedRolesService>(AssignedRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
