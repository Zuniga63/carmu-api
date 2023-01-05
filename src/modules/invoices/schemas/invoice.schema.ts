import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Customer } from 'src/modules/customers/schemas/customer.schema';
import { User } from 'src/modules/users/schema/user.schema';
import { InvoiceItem, InvoiceItemSchema } from './invoice-item.schema';
import { InvoicePayment, InvoicePaymentSchema } from './invoice-payment.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Invoice {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  seller?: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer?: Customer;

  @Prop({ default: false })
  isSeparate: boolean;

  @Prop({ required: false })
  prefix?: string;

  @Prop({ required: false })
  number: number;

  @Prop({ required: false, default: 'Mostrador' })
  customerName: string;

  @Prop({ required: false })
  customerAddress?: string;

  @Prop({ required: false })
  customerPhone?: string;

  @Prop({ required: false })
  customerDocument?: string;

  @Prop({ required: false, enum: ['CC', 'NIT', 'PAP', 'TI'] })
  customerDocumentType: string;

  @Prop({ required: false })
  sellerName: string;

  @Prop({ required: false })
  expeditionDate: Date;

  @Prop({ required: false })
  expirationDate: Date;

  @Prop({ type: [InvoiceItemSchema], default: [] })
  items: InvoiceItem[];

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ required: false })
  discount?: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ required: false })
  cash?: number;

  @Prop({ required: false })
  credit?: number;

  @Prop({ required: false })
  cashChange?: number;

  @Prop({ required: false })
  balance?: number;

  @Prop({ type: [InvoicePaymentSchema], default: [] })
  payments: InvoicePayment[];

  @Prop({ default: false })
  cancel: boolean;

  @Prop({ required: false })
  cancelMessage?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.virtual('prefixNumber').get(function getPrefixNumber() {
  const { prefix, number } = this;
  let result = '';
  if (prefix) result = `${prefix}-`;
  if (number && number < 10) result = result.concat('0');
  return result.concat(String(number));
});
