import { model, Model, Schema } from 'mongoose';
import { IInvoicePayment } from 'src/types';

const schema = new Schema<IInvoicePayment, Model<IInvoicePayment>>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    isSeparate: { type: Boolean, default: false },
    paymentDate: Date,
    description: String,
    amount: { type: Number, required: [true, 'El importe es requerido.'] },
    initialPayment: Boolean,
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

export default model<IInvoicePayment>('InvoicePayment', schema);
