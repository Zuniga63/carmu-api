import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Phone extends Document {
  @Prop({ required: true, maxlength: 20 })
  number: string;

  @Prop({ maxlength: [20, 'Utiliza un maximo de 20 caracteres.'] })
  description?: string;

  @Prop({ default: false })
  whatsapp: boolean;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);
