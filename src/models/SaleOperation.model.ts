import dayjs from 'dayjs';
import { model, Schema } from 'mongoose';
import { ISaleOperation } from 'src/types';

const schema = new Schema<ISaleOperation>({
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  operationDate: { type: Date, required: true, default: dayjs().toDate() },
  operationType: {
    type: String,
    enum: ['sale', 'purchase', 'credit', 'credit_payment', 'separate', 'separate_payment', 'exchange'],
    required: true,
  },
  amount: { type: Number, required: true },
  description: String,
});

export default model<ISaleOperation>('SaleOperation', schema);
