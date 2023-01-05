import { Module } from '@nestjs/common';
import { CashboxsService } from './cashboxs.service';
import { CashboxsController } from './cashboxs.controller';

@Module({
  controllers: [CashboxsController],
  providers: [CashboxsService],
})
export class CashboxsModule {}
