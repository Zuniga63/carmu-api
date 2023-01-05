import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.schema';
import { createSlug } from 'src/utils';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;

          // ------------------------------------------------------------------
          // HOOK FOR SAVE
          // ------------------------------------------------------------------
          schema.pre('save', async function preSave(next) {
            if (this.isModified('name')) {
              this.slug = createSlug(this.name);
            }

            next();
          });

          // ------------------------------------------------------------------
          // VIRTUALS
          // ------------------------------------------------------------------
          schema.virtual('urlSlug').get(function getUrlSlug() {
            return encodeURIComponent(this.slug);
          });

          return schema;
        },
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
