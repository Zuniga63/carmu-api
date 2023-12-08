import { model, Model, models, Schema } from 'mongoose';
import { IInvoice, IInvoiceItem, IInvoicePayment, InvoiceDocumentProps } from 'src/types';

type InvoiceModelType = Model<IInvoice, {}, InvoiceDocumentProps>;

// ----------------------------------------------------------------------------
// ITEM SCHEMA
// ----------------------------------------------------------------------------

const itemSchema = new Schema<IInvoiceItem, Model<IInvoiceItem>>(
  {
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    productSize: { type: Schema.Types.ObjectId, ref: 'ProductSize' },
    productColor: { type: Schema.Types.ObjectId, ref: 'ProductColor' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    description: { type: String, required: [true, 'La descripción es requerida'] },
    quantity: { type: Number, required: [true, 'La cantidad es requerida.'], min: [0.01, 'Debe ser mayor que cero.'] },
    unitValue: {
      type: Number,
      required: [true, 'El valor unitario es requerido'],
      min: [0.01, 'Debe ser mayor que cero.'],
    },
    discount: Number,
    amount: { type: Number, required: true },
    balance: Number,
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
  },
  { timestamps: true },
);

itemSchema.pre('validate', async function preValidate(next) {
  if (this.isNew) {
    const { categories, product, productColor, productSize, quantity, unitValue, discount } = this;

    if (quantity && unitValue) {
      this.amount = quantity * unitValue;
      if (discount) this.amount -= quantity * discount;
      this.balance = this.amount;
    }

    if (categories.length) {
      const promiseResult = await Promise.all(
        categories.map((categoryId) => models.Category.exists({ _id: categoryId })),
      );

      this.categories = promiseResult.filter((item) => item).map((item) => item?._id);
    }

    if (product) this.product = (await models.Product.exists({ _id: product }))?._id;
    if (productColor) this.productColor = undefined;
    if (productSize) this.productSize = undefined;

    this.tags = [];
  }

  next();
});

// ----------------------------------------------------------------------------
// PAYMENT SCHEMA
// ----------------------------------------------------------------------------

const paymentSchema = new Schema<IInvoicePayment, Model<IInvoicePayment>>(
  {
    paymentDate: Date,
    description: String,
    amount: { type: Number, required: [true, 'El importe es requerido.'], min: 0.01 },
    initialPayment: Boolean,
    cancel: Boolean,
    cancelMessage: String,
  },
  { timestamps: true },
);

// ----------------------------------------------------------------------------
// INVOICE SCHEMA
// ----------------------------------------------------------------------------
const invoiceSchema = new Schema<IInvoice, InvoiceModelType>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    premiseStore: { type: Schema.Types.ObjectId, ref: 'Store' },
    isSeparate: { type: Boolean, default: false },
    prefix: String,
    number: Number,
    customerName: { type: String, default: 'Mostrador' },
    customerAddress: String,
    customerPhone: String,
    customerDocument: String,
    customerDocumentType: { type: String, enum: ['CC', 'NIT', 'PAP', 'TI'] },
    sellerName: String,
    expeditionDate: Date,
    expirationDate: Date,
    items: {
      type: [itemSchema],
      minlength: [1, 'Se requiere almenos un item.'],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: Number,
    amount: { type: Number, default: 0 },
    cash: Number,
    credit: Number,
    cashChange: Number,
    balance: Number,
    payments: [paymentSchema],
    cancel: { type: Boolean, default: false },
    cancelMessage: String,
    christmasTicket: { type: Number },
  },
  { timestamps: true },
);

invoiceSchema.virtual('prefixNumber').get(function getPrefixNumber() {
  const { prefix, number } = this;
  let result = '';
  if (prefix) result = `${prefix}-`;
  if (number && number < 10) result = result.concat('0');
  return result.concat(String(number));
});

invoiceSchema.pre('save', async function preSave(next) {
  // Set the invoice number
  if (this.isNew) {
    const invoice = this;
    const { cash, items } = this;

    invoice.number = (await models.Invoice.count()) + 1;
    let cashSurplus = cash;

    items.forEach((item) => {
      // Set subtotal and discount
      invoice.subtotal += item.quantity * item.unitValue;

      if (item.discount) {
        const discount = item.quantity * item.discount;
        if (invoice.discount) invoice.discount += discount;
        else invoice.discount = discount;
      }

      if (cashSurplus && item.balance) {
        if (cashSurplus >= item.balance) {
          cashSurplus -= item.balance;
          item.balance = undefined;
        } else {
          item.balance -= cashSurplus;
          cashSurplus = 0;
        }
      }

      invoice.amount += item.amount;
      if (invoice.credit) invoice.credit += item.balance || 0;
      else invoice.credit = item.balance;
    });

    invoice.cashChange = cashSurplus || undefined;
    invoice.balance = invoice.credit;
    invoice.isSeparate = Boolean(invoice.isSeparate && invoice.balance);
  }

  next();
});

export default model<IInvoice, InvoiceModelType>('Invoice', invoiceSchema);
