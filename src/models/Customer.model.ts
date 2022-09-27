import { model, Model, models, Schema } from 'mongoose';
import { CustomerDocumentProps, ICustomer, ICustomerContact } from 'src/types';
import { emailRegex } from 'src/utils';

type CustomerModelType = Model<ICustomer, {}, CustomerDocumentProps>;

const contactsSchema = new Schema<ICustomerContact>({
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: [20, 'Descripción muy larga.'],
    required: [true, 'La descripción es requerida.'],
  },
});

const schema = new Schema<ICustomer, CustomerModelType>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    firstName: {
      type: String,
      minlength: [3, 'Nombre demasiado corto.'],
      maxlength: [90, 'Nombre muy largo.'],
      required: [true, 'Nombre del cliente es requerido.'],
    },
    lastName: {
      type: String,
      minlength: [3, 'Apellido demasiado corto.'],
      maxlength: [90, 'Apellido muy largo.'],
    },
    alias: {
      type: String,
      minlength: [3, 'Alias demasiado corto.'],
      maxlength: [90, 'Alias muy largo.'],
    },
    observation: String,
    email: {
      type: String,
      match: [emailRegex, 'No es un correo electronico válido.'],
      validate: [
        {
          async validator(value: string) {
            try {
              const customer = await models.Customer.findOne({ email: value });
              return !customer;
            } catch (error) {
              return false;
            }
          },
          message: 'Ya existe un cliente registrado con este correo.',
        },
      ],
    },
    contacts: [contactsSchema],
    address: String,
    documentType: {
      type: String,
      default: 'CC',
    },
    documentNumber: {
      type: String,
      validate: [
        {
          async validator(value: string) {
            try {
              const customer = await models.Customer.findOne({ documentNumber: value });
              return !customer;
            } catch (error) {
              return false;
            }
          },
          message: 'Ya existe un cliente registrado con este numero de coumento.',
        },
      ],
    },
    birthDate: Date,
    profilePhoto: Object,
  },
  { timestamps: true },
);

export default model<ICustomer, CustomerModelType>('Customer', schema);
