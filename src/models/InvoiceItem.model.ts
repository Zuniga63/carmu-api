import { model, Model, Schema } from 'mongoose';
import { IInvoiceItem } from 'src/types';

const schema = new Schema<IInvoiceItem, Model<IInvoiceItem>>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productSize: { type: Schema.Types.ObjectId, ref: 'ProductSize' },
    productColor: { type: Schema.Types.ObjectId, ref: 'ProductColor' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isSeparate: { type: Boolean, default: false },
    description: { type: String, required: [true, 'La descripción es requerida'] },
    quantity: { type: Number, required: [true, 'La cantidad es requerida.'], min: [0, 'Debe ser mayor que cero.'] },
    unitValue: {
      type: Number,
      required: [true, 'El valor unitario es requerido'],
      min: [0, 'Debe ser mayor que cero.'],
    },
    discount: Number,
    amount: { type: Number, required: true },
    balance: Number,
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

export default model<IInvoiceItem>('InoviceItem', schema);
