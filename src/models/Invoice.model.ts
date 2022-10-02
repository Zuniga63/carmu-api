import { model, Model, Schema } from 'mongoose';
import { IInvoice } from 'src/types';

const schema = new Schema<IInvoice, Model<IInvoice>>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    isSeparate: { type: Boolean, default: false },
    prefix: String,
    number: Number,
    customerName: { type: String, default: 'Cliente mostrador' },
    customerAddress: String,
    customerPhone: String,
    customerDocument: String,
    customerDocumentType: { type: String, enum: ['CC', 'NIT', 'PAP', 'TI'] },
    sellerName: String,
    expeditionDate: Date,
    expirationDate: Date,
    invoiceItems: [{ type: Schema.Types.ObjectId, ref: 'InvoiceItem' }],
    subtotal: Number,
    discount: Number,
    amount: { type: Number, required: true },
    cash: Number,
    credit: Number,
    cashChange: Number,
    balance: Number,
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

export default model<IInvoice>('Invoice', schema);
