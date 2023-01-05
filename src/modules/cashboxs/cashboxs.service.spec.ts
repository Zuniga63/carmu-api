import { Test, TestingModule } from '@nestjs/testing';
import { CashboxsService } from './cashboxs.service';

describe('CashboxsService', () => {
  let service: CashboxsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashboxsService],
    }).compile();

    service = module.get<CashboxsService>(CashboxsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
