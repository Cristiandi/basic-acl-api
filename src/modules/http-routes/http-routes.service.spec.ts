import { Test, TestingModule } from '@nestjs/testing';
import { HttpRoutesService } from './http-routes.service';

describe('HttpRoutesService', () => {
  let service: HttpRoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpRoutesService]
    }).compile();

    service = module.get<HttpRoutesService>(HttpRoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
