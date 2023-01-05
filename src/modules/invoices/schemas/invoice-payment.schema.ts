import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class InvoicePayment {
  @Prop({ type: Date, required: true })
  paymentDate: Date;

  @Prop({ required: false })
  description?: string;

  @Prop({
    required: [true, 'El valor del pago es requerido'],
    min: [0.01, 'Debe ser mayor que cero'],
  })
  amount: number;

  @Prop({ default: false })
  initialPayment: boolean;

  @Prop({ default: false })
  cancel: boolean;

  @Prop({ required: false })
  errorMessage?: string;
}

export const InvoicePaymentSchema =
  SchemaFactory.createForClass(InvoicePayment);
