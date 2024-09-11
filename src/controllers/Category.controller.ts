import { Request, Response } from 'express';
import { destroyResource } from 'src/middleware/formData';
import CategoryModel from 'src/models/Category.model';
import ProductModel from 'src/models/Product.model';
import SaleOperationModel from 'src/models/SaleOperation.model';
import { CategoryHydrated, ProductHydrated, StoreCategoryRequest, UpdateCategoryRequest } from 'src/types';
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
    const category = await CategoryModel.findByIdAndDelete(categoryId).populate<{ products: ProductHydrated[] }>(
      'products',
      'categories',
    );
    if (!category) throw new NotFoundError('Categoría no encontrada.');

    // Remove ref in products
    await Promise.all(
      category.products.map((product) => {
        product.categories = product.categories.filter((categoryId) => !categoryId.equals(category._id));
        return product.save({ validateBeforeSave: false });
      }),
    );

    res.status(200).json({ category });
  } catch (error) {
    sendError(error, res);
  }
}

export async function storeNewOrder(req: Request, res: Response) {
  const { categoryIds, mainCategory }: { categoryIds: string[]; mainCategory: undefined | string } = req.body;
  const categories: CategoryHydrated[] = [];

  try {
    if (Array.isArray(categoryIds) && categoryIds.every(id => typeof id === 'string')) {
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

export async function combineCategories(_req: Request, res: Response) {
  const categoriesToComnbine = [
    '656b5d9b052ee17d01d569a0',
    '656b5da8052ee17d01d569a8',
    '656b5db4052ee17d01d569b0',
    '656b5dc1052ee17d01d569b8',
    '656b5dce052ee17d01d569c0',
    '656b5ddd052ee17d01d569c8',
    '656b5df0052ee17d01d569d0',
    '656b5e35052ee17d01d569d8',
  ];
  const productCount = await ProductModel.countDocuments({ categories: { $in: ['635ee35f07b472b5971268bd'] } });

  // Recupero las categorías que estan en la lista de categoriesToComnbine
  const categories = await CategoryModel.find({ _id: { $in: categoriesToComnbine } });
  // Recupero los productos que tienen alguna de las categorías de la lista
  const products = await ProductModel.find({ categories: { $in: categoriesToComnbine } });

  // Ahora recupero las operaciones de ventas que tienen las categorías de la lista
  const saleOperations = await SaleOperationModel.find({ categories: { $in: categoriesToComnbine } });

  // Recupero la categoría a la que se le van a asignar los productos
  const category = await CategoryModel.findById('635ee35f07b472b5971268bd');

  if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

  // Asigno los productos a la nueva categoría y agrepo los productos a la nueva categoría
  await Promise.all(
    products.map(async (product) => {
      product.categories = [category._id];
      await product.save({ validateBeforeSave: false });
    }),
  );

  // Agrego los producto a la neuva categoría
  category.products = [...category.products, ...products.map((product) => product._id)];
  await category.save({ validateBeforeSave: false });

  // Asigno las operaciones de venta a la nueva categoría
  await Promise.all(
    saleOperations.map(async (saleOperation) => {
      saleOperation.categories = [category._id];
      await saleOperation.save({ validateBeforeSave: false });
    }),
  );

  // Retiro los productos de las categorías anteriores
  await Promise.all(
    categories.map(async (category) => {
      category.products = [];
      await category.save({ validateBeforeSave: false });
    }),
  );

  return res
    .status(200)
    .json({
      categories: categories.length,
      products: products.length,
      productCount,
      category: category.name,
      saleOperations: saleOperations.length,
    });
}
