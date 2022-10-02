import { model, Model, Schema } from 'mongoose';
import { IInvoice, IInvoiceItem, IInvoicePayment, InvoiceDocumentProps } from 'src/types';

type InvoiceModelType = Model<IInvoice, {}, InvoiceDocumentProps>;

const itemSchema = new Schema<IInvoiceItem, Model<IInvoiceItem>>(
  {
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productSize: { type: Schema.Types.ObjectId, ref: 'ProductSize' },
    productColor: { type: Schema.Types.ObjectId, ref: 'ProductColor' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
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

const paymentSchema = new Schema<IInvoicePayment, Model<IInvoicePayment>>(
  {
    paymentDate: Date,
    description: String,
    amount: { type: Number, required: [true, 'El importe es requerido.'] },
    initialPayment: Boolean,
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

const invoiceSchema = new Schema<IInvoice, InvoiceModelType>(
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
    items: [itemSchema],
    subtotal: Number,
    discount: Number,
    amount: { type: Number, required: true },
    cash: Number,
    credit: Number,
    cashChange: Number,
    balance: Number,
    payments: [paymentSchema],
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

invoiceSchema.virtual('prefixNumber').get(function getPrefixNumber() {
  const { prefix, number } = this;
  let result = '';
  if (prefix) result = `${prefix}-`;
  if (number < 10) result = result.concat('0');
  return result.concat(String(number));
});

export default model<IInvoice, InvoiceModelType>('Invoice', invoiceSchema);
