import { model, Model, Schema } from 'mongoose';
import { ICashClosingRecord } from 'src/types';

const schema = new Schema<ICashClosingRecord, Model<ICashClosingRecord>>(
  {
    cashbox: { type: Schema.Types.ObjectId, ref: 'Cashbox' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cashier: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    cashierName: String,
    boxName: String,
    opened: {
      type: Date,
      required: [true, 'La fecha de apertura es requerida.'],
    },
    closingDate: {
      type: Date,
      required: [true, 'La fecha de cierre es requerida.'],
    },
    base: {
      type: Number,
      required: [true, 'La base es requerida'],
    },
    incomes: Number,
    expenses: Number,
    cash: {
      type: Number,
      required: [true, 'Se requiere el conteo de caja'],
    },
    coins: Object,
    bills: Object,
    leftover: Number,
    missing: Number,
    observation: String,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'CashboxTransaction' }],
  },
  { timestamps: true },
);

export default model<ICashClosingRecord>('CashClosingRecord', schema);
