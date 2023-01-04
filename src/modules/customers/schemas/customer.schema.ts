import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/schema/user.schema';
import { emailRegex, IImage } from 'src/utils';
import { Phone, PhoneSchema } from './phone.schema';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
})
export class Customer {
  id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user?: User;

  @Prop({
    minlength: [3, 'Nombre demasiado corto.'],
    maxlength: [90, 'Nombre muy largo.'],
    required: [true, 'Nombre del cliente es requerido.'],
    trim: true,
  })
  firstName: string;

  @Prop({ maxlength: [90, 'Apellido muy largo.'], trim: true })
  lastName?: string;

  fullName: string;

  @Prop({ maxlength: [45, 'Alias muy largo.'], trim: true })
  alias?: string;

  @Prop({ maxlength: [255, 'Descripción muy extensa.'] })
  observation?: string;

  @Prop({
    match: [emailRegex, 'No es un correo electronico válido'],
    lowercase: true,
    validate: {
      async validator(value: string) {
        if (!value) return true;

        try {
          const customer = await this.model('Customer').exists({
            email: value,
          });

          return !customer;
        } catch (error) {
          return false;
        }
      },
      message: 'Correo electronico en uso.',
    },
  })
  email?: string;

  @Prop({ type: [PhoneSchema], default: [] })
  phones: Phone[];

  @Prop()
  address?: string;

  @Prop({ enum: ['CC', 'TI', 'PAP', 'NIT'] })
  documentType?: string;

  @Prop({
    validate: {
      async validator(value: string) {
        if (!value) return true;

        try {
          const customer = await this.model('Customer').exists({
            documentNumber: value,
          });

          return !customer;
        } catch (error) {
          return false;
        }
      },
      message: 'Numero de documento en uso.',
    },
  })
  documentNumber?: string;

  @Prop({ type: Object })
  profilePhoto?: IImage;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
