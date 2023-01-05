import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { mainCategory: mainCategoryId } = createCategoryDto;

    const category = new this.categoryModel({
      createCategoryDto,
    });

    if (mainCategoryId) {
      const mainCategory = await this.categoryModel
        .findById(mainCategoryId)
        .select('level subcategories');

      if (mainCategory) {
        mainCategory.subcategories.push(category);
        category.level = mainCategory.level + 1;
        category.order = mainCategory.subcategories.length;

        await mainCategory.save();
      } else {
        category.mainCategory = undefined;
      }
    }

    category.order = category.order
      ? category.order
      : (await this.categoryModel.where('mainCategory', undefined).count()) + 1;

    await category.save({ validateBeforeSave: true });

    return category;
  }

  findAll() {
    return this.categoryModel.find({ level: 0 });
  }

  findOne(id: string) {
    return this.categoryModel
      .findById(id)
      .populate('mainCategory')
      .populate('subcategories');
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
