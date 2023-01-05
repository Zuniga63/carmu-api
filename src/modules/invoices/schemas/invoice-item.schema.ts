import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema';
import { Product } from 'src/modules/products/schemas/product.schema';

@Schema({ timestamps: true })
export class InvoiceItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categories: Category[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  product?: Product;

  @Prop({ required: false })
  description: string;

  @Prop({
    required: [true, 'La cantidad es requerida.'],
    min: [0.01, 'Debe ser mayor que cero.'],
  })
  quantity: number;

  @Prop({
    required: [true, 'El valor unitario es requerido'],
    min: [0.01, 'Debe ser mayor que cero.'],
  })
  unitValue: number;

  @Prop({ required: false })
  discount?: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ require: false })
  balance?: number;

  @Prop({ default: false })
  cancel: boolean;

  @Prop({ required: false })
  cancelMessage?: string;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);
