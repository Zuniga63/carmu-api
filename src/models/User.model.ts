import { Schema, model, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { emailRegex, strongPass } from 'src/utils';
import { IUserModel } from 'src/types';

const schema = new Schema<IUserModel, Model<IUserModel>>(
  {
    name: {
      type: String,
      minlength: [3, 'Nombre demasiado corto.'],
      maxlength: [90, 'Nombre de usuario muy largo.'],
      required: [true, 'Nombre de usuario es requerido.'],
    },
    email: {
      type: String,
      required: [true, 'Se requiere el correo electronico.'],
      match: [emailRegex, 'No es un correo electronico válido.'],
      validate: [
        {
          async validator(value: string) {
            try {
              const user = await models.User.findOne({ email: value });
              return !user;
            } catch (error) {
              return false;
            }
          },
          message: 'Ya existe un usuario registrado con este correo.',
        },
      ],
    },
    emailVerifiedAt: Schema.Types.Date,
    password: {
      type: String,
      minlength: [8, 'Debe tener minimo 8 caracteres.'],
      match: [strongPass, 'La contraseña no es segura'],
      required: [true, 'Se requiere una contraseña.'],
    },
    rememberToken: String,
    profilePhoto: Object,
    role: {
      type: String,
      enum: ['admin', 'editor', 'seller', 'user'],
      default: 'user',
    },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    boxes: [{ type: Schema.Types.ObjectId, ref: 'Cashbox' }],
  },
  { timestamps: true },
);

schema.pre('save', function encryptPassword(next) {
  const user = this;
  const saltRounds = 10;

  if (this.isModified('password') || this.isNew) {
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

export default model<IUserModel>('User', schema);
