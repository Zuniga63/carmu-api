import { Category } from 'src/modules/categories/schemas/category.schema';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type SaleOperationDocument = HydratedDocument<SaleOperation>;

export class SaleOperation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categories: Category[];

  @Prop({ type: Date, required: true })
  operationDate: Date;

  @Prop({
    enum: [
      'sale',
      'purchase',
      'credit',
      'credit_payment',
      'separate',
      'separate_payment',
      'exchange',
    ],
    required: true,
  })
  OperationType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: false })
  description?: string;
}

export const SaleOperationSchema = SchemaFactory.createForClass(SaleOperation);
