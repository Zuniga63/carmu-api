import { model, Model, models, Schema } from 'mongoose';
import { CustomerDocumentProps, ICustomer, ICustomerContact } from 'src/types';
import { emailRegex, removeNonNumericChars } from 'src/utils';

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
      enum: ['CC', 'TI', 'PAP', 'NIT'],
    },
    documentNumber: {
      type: String,
      validate: [
        {
          async validator(value: string) {
            try {
              if (value) {
                const customer = await models.Customer.findOne({ documentNumber: value });
                return !customer;
              }
              return true;
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
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
  },
  { timestamps: true },
);

schema.pre('validate', function preSave(next) {
  const customer = this;
  if (this.documentNumber && (this.isModified('documentNumber') || this.isNew)) {
    customer.documentNumber = removeNonNumericChars(this.documentNumber);
  }
  next();
});

schema.virtual('fullName').get(function () {
  let fullName: string = this.firstName;
  if (this.lastName) fullName = `${fullName} ${this.lastName}`;
  return fullName;
});

export default model<ICustomer, CustomerModelType>('Customer', schema);
