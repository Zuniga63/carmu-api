import { Test, TestingModule } from '@nestjs/testing';
import { CashboxsController } from './cashboxs.controller';
import { CashboxsService } from './cashboxs.service';

describe('CashboxsController', () => {
  let controller: CashboxsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashboxsController],
      providers: [CashboxsService],
    }).compile();

    controller = module.get<CashboxsController>(CashboxsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
