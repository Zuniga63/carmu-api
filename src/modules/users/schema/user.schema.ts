import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Customer } from 'src/modules/customers/schemas/customer.schema';
import { Role } from 'src/modules/roles/schemas/role.schema';
import { emailRegex, IImage } from 'src/utils';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class User {
  id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role?: Role;

  @Prop({
    required: [true, 'El nombre de usuario es requerido'],
    minlength: [3, 'El nombre de usuario es muy corto.'],
    maxlength: [90, 'El nombre de usuario es muy largo'],
  })
  name: string;

  @Prop({
    unique: true,
    match: [emailRegex, 'No es un correo electronico válido'],
    lowercase: true,
  })
  email: string;

  @Prop({ type: Date, required: false })
  emailVerifiedAt?: Date;

  @Prop({ required: [true, 'Se requeire una contraseña'] })
  password: string;

  @Prop({ type: Object })
  profilePhoto?: IImage;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customer?: Customer;
}

export const UserSchema = SchemaFactory.createForClass(User);