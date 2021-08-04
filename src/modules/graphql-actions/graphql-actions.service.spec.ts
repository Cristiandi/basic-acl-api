import { Test, TestingModule } from '@nestjs/testing';
import { GraphqlActionsService } from './graphql-actions.service';

describe('GraphqlActionsService', () => {
  let service: GraphqlActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphqlActionsService]
    }).compile();

    service = module.get<GraphqlActionsService>(GraphqlActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
