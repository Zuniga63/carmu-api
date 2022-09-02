import { Request, Response } from 'express';
import { destroyResource } from 'src/middleware/formData';
import CategoryModel from 'src/models/Category.model';
import { CategoryHydrated, StoreCategoryRequest, UpdateCategoryRequest } from 'src/types';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

export async function list(_req: Request, res: Response) {
  try {
    const categories = await CategoryModel.find().sort('order level');
    res.status(200).json({ categories });
  } catch (error) {
    sendError(error, res);
  }
}

/**
 * Create a new category of level 0
 * @param req
 * @param res
 */
export async function store(req: Request, res: Response) {
  const { name, description, image }: StoreCategoryRequest = req.body;
  try {
    // get the count of category in databse
    const count = await CategoryModel.where('level', 0).count();

    // create a new category
    const category = await CategoryModel.create({
      name,
      description,
      image,
      order: count + 1,
    });

    res.status(201).json({ category });
  } catch (error) {
    if (image) await destroyResource(image.publicId);
    sendError(error, res);
  }
}

export async function show(req: Request, res: Response) {
  const { categoryId } = req.params;
  try {
    const category = await CategoryModel.findById(categoryId).populate('mainCategory').populate('subcategories');
    if (!category) throw new NotFoundError('Categoría no encontrada');

    res.status(200).json({ category });
  } catch (error) {
    sendError(error, res);
  }
}

export async function update(req: Request, res: Response) {
  const { name, description, image, isEnabled, order: reqOrder }: UpdateCategoryRequest = req.body;
  const order = Number(reqOrder);
  const { categoryId } = req.params;
  try {
    const category = await CategoryModel.findById(categoryId);
    if (!category) throw new NotFoundError('Categoría no encontrada.');

    if (name !== category.name) category.name = name;
    category.description = description;
    category.isEnabled = isEnabled ? isEnabled === 'true' : false;

    // update order
    if (!isNaN(order) && category.order !== order) category.order = order;

    const lastImage = category.image;
    if (image) category.image = image;

    await category.save({ validateModifiedOnly: true });
    if (image && lastImage) await destroyResource(lastImage.publicId);

    res.status(200).json({ category });
  } catch (error) {
    if (image) await destroyResource(image.publicId);
    sendError(error, res);
  }
}

export async function destroy(req: Request, res: Response) {
  const { categoryId } = req.params;

  try {
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) throw new NotFoundError('Categoría no encontrada.');

    res.status(200).json({ category });
  } catch (error) {
    sendError(error, res);
  }
}

export async function storeNewOrder(req: Request, res: Response) {
  const { categoryIds, mainCategory }: { categoryIds: string[]; mainCategory: undefined | string } = req.body;
  const categories: CategoryHydrated[] = [];

  try {
    if (categoryIds instanceof Array<string>) {
      // Get the count of categories of three
      const count = await CategoryModel.count().where({ mainCategory });

      if (categoryIds.length === count) {
        // Recover each categories instances
        await Promise.all(
          categoryIds.map(async (categoryId, index) => {
            const order = index + 1;
            const category = await CategoryModel.findById(categoryId);
            if (category && category.order !== order) {
              category.order = index + 1;
              categories.push(category);
            }
          }),
        );

        // Save the new order category
        await Promise.all(categories.map((category) => category.save({ validateModifiedOnly: true })));

        res.status(200).json({ ok: true });
        return;
      }
    }

    res.status(200).json({ ok: false });
  } catch (error) {
    sendError(error, res);
  }
}
