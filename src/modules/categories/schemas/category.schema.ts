import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema';
import { createSlug, IImage } from 'src/utils';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: false,
  })
  mainCategory?: Category;

  @Prop({
    minlength: [3, 'Debe tener minimo 3 caracteres.'],
    maxlength: [45, 'Debe tener una maximo de 45 caracteres'],
    required: [true, 'El campo nombre es requerido.'],
    validate: {
      async validator(value: string) {
        const slug = createSlug(value);

        try {
          const category = await this.model('Category').exists({ slug });
          return !category;
        } catch (error) {
          return false;
        }
      },
    },
  })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({
    required: false,
    maxlength: [255, 'Debe tener una maximo de 255 caracteres'],
  })
  description?: string;

  @Prop({ type: Object })
  image: IImage;

  @Prop({ required: true, default: 0 })
  level: number;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ required: true, default: true })
  isEnabled: boolean;

  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Category',
  })
  subcategories: Category[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
