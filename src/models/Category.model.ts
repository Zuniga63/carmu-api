import { Schema, model, models, Model } from 'mongoose';
import { ICategory } from 'src/types';
import { createSlug } from 'src/utils';

const schema = new Schema<ICategory, Model<ICategory>>(
  {
    mainCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    name: {
      type: String,
      minlength: [3, 'Debe tener minimo 3 caracteres.'],
      maxlength: [45, 'Debe tener una maximo de 45 caracteres'],
      required: [true, 'El campo nombre es requerido.'],
      validate: [
        {
          async validator(value: string) {
            const slug = createSlug(value);
            try {
              const category = await models.Category.findOne({
                slug,
              });
              return !category;
            } catch (error) {
              return false;
            }
          },
          message: 'Ya existe una categoría con este nombre.',
        },
      ],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [255, 'Debe tener una maximo de 255 caracteres'],
    },
    image: Object,
    level: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    subcategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true },
);

schema.pre('save', function preSave(next) {
  const product = this;

  if (this.isModified('name') || this.isNew) {
    product.slug = createSlug(product.name);
  }

  next();
});

schema.virtual('urlSlug').get(function getUrlSlug() {
  return encodeURIComponent(this.slug);
});

export default model<ICategory>('Category', schema);
