import { Module } from '@nestjs/common';
import { CashboxsService } from './cashboxs.service';
import { CashboxsController } from './cashboxs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cashbox, CashboxSchema } from './schemas/cashbox.schema';
import {
  CashboxTransaction,
  CashboxTransactionSchema,
} from './schemas/cashbox-transaction.schema';
import {
  CashClosingRecord,
  CashClosingRecordSchema,
} from './schemas/cash-closing-record.schema';
import { User, UserSchema } from '../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cashbox.name, schema: CashboxSchema },
      { name: CashboxTransaction.name, schema: CashboxTransactionSchema },
      { name: CashClosingRecord.name, schema: CashClosingRecordSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CashboxsController],
  providers: [CashboxsService],
})
export class CashboxsModule {}
