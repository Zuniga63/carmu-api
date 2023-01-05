import { Test, TestingModule } from '@nestjs/testing';
import { SaleOperationsController } from './sale-operations.controller';
import { SaleOperationsService } from './sale-operations.service';

describe('SaleOperationsController', () => {
  let controller: SaleOperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleOperationsController],
      providers: [SaleOperationsService],
    }).compile();

    controller = module.get<SaleOperationsController>(SaleOperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
