import { Model, Schema, models, model } from 'mongoose';
import { IProduct } from 'src/types';
import { createSlug } from 'src/utils';

const schema = new Schema<IProduct, Model<IProduct>>(
  {
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'ProductTag' }],
    colors: [{ type: Schema.Types.ObjectId, ref: 'ProductColor' }],
    sizes: [{ type: Schema.Types.ObjectId, ref: 'ProductSize' }],
    name: {
      type: String,
      minlength: [3, 'Debe tener minimo 3 caracteres.'],
      maxlength: [90, 'Debe tener una maximo de 90 caracteres'],
      required: [true, 'El campo nombre es requerido.'],
    },
    ref: {
      type: String,
      validate: [
        {
          async validator(value: string) {
            if (value) {
              try {
                return !(await models.Product.exists({ ref: value }));
              } catch (error) {
                return false;
              }
            }

            return true;
          },
          message: 'Ya existe un producto con esta referencia.',
        },
      ],
    },
    barcode: {
      type: String,
      validate: [
        {
          async validator(value: string) {
            let barcodeExist = false;
            if (value) {
              try {
                barcodeExist = Boolean(await models.Product.exists({ barcode: value }));
              } catch (error) {
                barcodeExist = true;
              }
            }

            return !barcodeExist;
          },
          message: 'Ya existe un producto con este codigo.',
        },
      ],
    },
    description: String,
    image: Object,
    productSize: String,
    images: [{ type: Schema.Types.ObjectId, ref: 'ProductImage' }],
    isInventoriable: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      min: [0, 'Debe ser mayor que cero.'],
      required: true,
      default: 0,
    },
    hasDiscount: Boolean,
    priceWithDiscount: Number,
    productIsNew: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
    returned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

schema.virtual('slug').get(function getUrlSlug() {
  return encodeURIComponent(createSlug(this.name));
});

export default model<IProduct>('Product', schema);
