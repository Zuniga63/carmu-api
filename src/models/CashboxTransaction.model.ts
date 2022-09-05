import { model, Model, Schema } from 'mongoose';
import { ICashboxTransaction } from 'src/types';

const schema = new Schema<ICashboxTransaction, Model<ICashboxTransaction>>(
  {
    cashbox: { type: Schema.Types.ObjectId, ref: 'Cashbox' },
    transactionDate: {
      type: Date,
      required: [true, 'La fecha es requerida.'],
    },
    description: String,
    isTransfer: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: [true, 'El monto es requerido'],
    },
  },
  { timestamps: true },
);

export default model<ICashboxTransaction>('CashboxTransaction', schema);
