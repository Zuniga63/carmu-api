import { Schema, model, models, Model } from 'mongoose';
import { destroyResource } from 'src/middleware/formData';
import { CategoryHydrated, ICategory } from 'src/types';
import { createSlug } from 'src/utils';
import NotFoundError from 'src/utils/errors/NotFoundError';

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

schema.pre('save', async function preSave(next) {
  const category = this;

  // Code for update the slug
  if (this.isModified('name') || this.isNew) {
    category.slug = createSlug(category.name);
  }

  // update the order
  if (this.isModified('order')) {
    try {
      const previousCategory: CategoryHydrated | undefined = await models.Category.findById(category.id).select(
        '_id order',
      );

      // update the order of next categories
      if (previousCategory) {
        console.log('The order of category change to: %d from %d', category.order, previousCategory?.order);
        const reduceOrder = await models.Category.updateMany(
          { mainCategory: category.mainCategory },
          { $inc: { order: -1 } },
        )
          .where('order')
          .gt(previousCategory.order);
        console.log('Categories reduce order: %s', reduceOrder.modifiedCount);

        const count = await models.Category.count();
        if (category.order < count) {
          const upgradeSort = await models.Category.updateMany(
            { mainCategory: category.mainCategory },
            { $inc: { order: 1 } },
          )
            .where('_id')
            .ne(category._id)
            .where('order')
            .gte(category.order);
          console.log('Categories reduce order: %s', upgradeSort.modifiedCount);
        }

        if (category.order > count) category.order = count;
      }
    } catch (error: any) {
      next(error);
      return;
    }
  }

  next();
});

schema.pre('findOneAndDelete', async function preQuery(next) {
  const { _id } = this.getFilter();
  console.log('Prequery to delete one by id:', _id);

  try {
    if (_id) {
      const category = await models.Category.findById(_id);
      if (!category) throw new NotFoundError('Categoría no encontrada.');

      // Delete the image of cloudinary
      if (category.image && category.image.publicId) {
        await destroyResource(category.image.publicId);
      }

      // TODO: Code for remove of products.

      // TODO: Code for delete subcategories.

      // *Update the order of categories in the level
      await models.Category.updateMany({ mainCategory: category.mainCategory }, { $inc: { order: -1 } })
        .where('order')
        .gt(category.order);
      next();
    }
  } catch (error: any) {
    console.log('Error in the Cateogry model');
    next(error);
  }
});

schema.virtual('urlSlug').get(function getUrlSlug() {
  return encodeURIComponent(this.slug);
});

export default model<ICategory>('Category', schema);
