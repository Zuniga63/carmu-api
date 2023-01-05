import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema';
import { createSlug, IImage } from 'src/utils';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, toObject: { virtuals: true } })
export class Product {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categories: Category[];

  @Prop({
    minlength: [3, 'Debe tener minimo 3 caracteres.'],
    maxlength: [90, 'Debe tener una maximo de 90 caracteres'],
    required: [true, 'El campo nombre es requerido.'],
  })
  name: string;

  @Prop({
    required: false,
    validate: {
      async validator(value: string) {
        if (!value) return true;

        try {
          return !(await this.model('Product').exists({ ref: value }));
        } catch (error) {
          return false;
        }
      },
      message: 'Ya existe un producto con esta referencia.',
    },
  })
  ref?: string;

  @Prop({
    required: true,
    validate: {
      async validator(value: string) {
        if (!value) return true;

        try {
          return !(await this.model('Product').exists({ barcode: value }));
        } catch (error) {
          return false;
        }
      },
      message: 'Ya existe un producto con este codigo.',
    },
  })
  barcode?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: Object, required: false })
  image?: IImage;

  @Prop({ default: false })
  isInventoriable: boolean;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ min: [0, 'Debe ser mayor que cero.'], required: true, default: 0 })
  price: number;

  @Prop({ default: false })
  hasDiscount: boolean;

  @Prop({ min: [0, 'Debe ser mayor que cero.'], required: false, default: 0 })
  priceWithDiscount: number;

  @Prop({ default: false })
  productIsNew: boolean;

  @Prop({ default: false })
  published: boolean;

  @Prop({ default: 0 })
  sold: number;

  @Prop({ default: 0 })
  returned: number;
}

const schema = SchemaFactory.createForClass(Product);
schema.virtual('slug').get(function getUrlSlug() {
  return encodeURIComponent(createSlug(this.name));
});

export default schema;
