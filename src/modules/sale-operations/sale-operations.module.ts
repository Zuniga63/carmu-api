import { Module } from '@nestjs/common';
import { SaleOperationsService } from './sale-operations.service';
import { SaleOperationsController } from './sale-operations.controller';

@Module({
  controllers: [SaleOperationsController],
  providers: [SaleOperationsService],
})
export class SaleOperationsModule {}
