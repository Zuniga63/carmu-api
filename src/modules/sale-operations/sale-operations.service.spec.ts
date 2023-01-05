import { Test, TestingModule } from '@nestjs/testing';
import { SaleOperationsService } from './sale-operations.service';

describe('SaleOperationsService', () => {
  let service: SaleOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleOperationsService],
    }).compile();

    service = module.get<SaleOperationsService>(SaleOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
