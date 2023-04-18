import { HydratedDocument, Schema, Types, Model, model } from 'mongoose';

export interface IStoreModel {
  name: string;
  address?: string;
  phone?: string;
  defaultBox?: Types.ObjectId;
  invoices: Types.ObjectId[];
  weeklySales?: number;
  monthlySales?: number;
}

export type StoreDocument = HydratedDocument<IStoreModel>;

const scheme = new Schema<IStoreModel, Model<IStoreModel>>({
  name: {
    type: String,
    minlength: [3, 'Nombre demasiado corto.'],
    maxlength: [90, 'Nombre de usuario muy largo.'],
    required: [true, 'Nombre del local es requerido'],
  },
  address: String,
  phone: String,
  defaultBox: { type: Schema.Types.ObjectId, ref: 'Cashbox' },
  invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
});

export default model<IStoreModel>('Store', scheme);
