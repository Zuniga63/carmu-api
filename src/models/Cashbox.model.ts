import { model, Model, Schema } from 'mongoose';
import { ICashbox } from 'src/types';

const schema = new Schema<ICashbox, Model<ICashbox>>(
  {
    cashier: { type: Schema.Types.ObjectId, ref: 'User' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    name: {
      type: String,
      required: true,
      minlength: [3, 'Debe tener minimo 3 caracteres'],
      maxlength: [45, 'Debe tener un maximo de 45 caracteres'],
    },
    base: {
      type: Number,
      default: 0,
    },
    lastClosing: Date,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'CashboxTransactions' }],
    closingRecords: [{ type: Schema.Types.ObjectId, ref: 'CashClosingRecord' }],
  },
  { timestamps: true },
);

export default model<ICashbox>('Cashbox', schema);
