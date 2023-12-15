import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { destroyResource } from 'src/middleware/formData';
import CategoryModel from 'src/models/Category.model';
import ProductModel from 'src/models/Product.model';
import { CategoryHydrated, IImage } from 'src/types';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

// ----------------------------------------------------------------------------
// UTILS
// ----------------------------------------------------------------------------
const getCategoryModels = async (list: unknown) => {
  let result: CategoryHydrated[] = [];

  if (list && Array.isArray(list)) {
    const uniqueIds = [...new Set(list)];
    const promises = await Promise.allSettled(
      uniqueIds.map((categoryId: string) => CategoryModel.findById(categoryId).select('name products')),
    );

    result = promises
      .filter((val) => val.status === 'fulfilled')
      .map((val) => (val as PromiseFulfilledResult<CategoryHydrated | null>).value)
      .filter((val) => val !== null) as CategoryHydrated[];
  }

  return result;
};

const removeProductRefInCategories = async (productId: Types.ObjectId, categories: CategoryHydrated[]) => {
  return await Promise.all(
    categories.map((category) => {
      category.products = category.products.filter((id) => !id.equals(productId));
      return category.save({ validateBeforeSave: false });
    }),
  );
};

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------
export async function list(req: Request, res: Response) {
  const { forList } = req.query;
  const productQuery = ProductModel.find({}).sort('name');

  if (forList === 'true') {
    productQuery.select('-images -isInventoriable -sold -returned');
  } else {
    productQuery.populate('categories', 'name');
  }

  try {
    const products = await productQuery.exec();
    res.status(200).json(products);
  } catch (error) {
    sendError(error, res);
  }
}

export async function store(req: Request, res: Response) {
  const { categoryIds, image, isInventoriable, initialStock, ...rest } = req.body;

  try {
    const categories = await getCategoryModels(categoryIds.split(','));
    const stock = isInventoriable && initialStock ? initialStock : 0;

    const product = await ProductModel.create({
      ...rest,
      categories: categories.map((c) => c._id),
      stock,
      sold: 0,
      returned: 0,
      isInventoriable: Boolean(isInventoriable),
    });

    categories.forEach((category) => category.products.push(product._id));
    await Promise.all([
      ...categories.map((c) => c.save({ validateBeforeSave: false })),
      product.populate('categories', 'name'),
    ]);

    res.status(201).json({ product });
  } catch (error) {
    if (image && (image as IImage).publicId) await destroyResource(image.publicId);
    sendError(error, res);
  }
}

export async function show(req: Request, res: Response) {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) throw new NotFoundError('Producto no encontrado');

    res.status(200).json({ product });
  } catch (error) {
    sendError(error, res);
  }
}

export async function update(req: Request, res: Response) {
  const { productId } = req.params;
  let lastImage: IImage | undefined;

  const {
    categoryIds,
    name,
    ref,
    barcode,
    description,
    productSize,
    image,
    stock,
    isInventoriable,
    price,
    hasDiscount,
    priceWithDiscount,
    productIsNew,
    published,
  } = req.body;

  try {
    // Get the product
    const product = await ProductModel.findById(productId).populate<{ categories: CategoryHydrated[] }>(
      'categories',
      'products',
    );
    if (!product) throw new NotFoundError('Producto no encontrado');

    // ------------------------------------------------------------------------
    // Save the basic information
    // ------------------------------------------------------------------------
    product.name = name;
    product.ref = ref;
    product.barcode = barcode;
    product.description = description;
    product.productSize = productSize;
    product.price = price;
    product.hasDiscount = hasDiscount;
    product.priceWithDiscount = priceWithDiscount;
    product.stock = stock;
    product.isInventoriable = isInventoriable;
    product.productIsNew = productIsNew;
    product.published = published;

    if (image) {
      if (product.image) lastImage = product.image;
      product.image = image;
    }

    await product.save({ validateModifiedOnly: true });
    if (lastImage) await destroyResource(lastImage.publicId);

    // ------------------------------------------------------------------------
    // UPDATE THE CATEGORY REF
    // ------------------------------------------------------------------------

    // Remove the product ref in the categories.
    if (product.categories.length) await removeProductRefInCategories(product._id, product.categories);

    // update ref in the product and categories
    product.categories = [];

    if (categoryIds) {
      const categories = await getCategoryModels(categoryIds.split(','));

      if (categories.length) {
        product.categories = categories;
        await Promise.all([
          ...categories.map((c) => {
            c.products.push(product._id);
            return c.save({ validateBeforeSave: false });
          }),
        ]);
      }
    }

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ product });
  } catch (error) {
    if (image && (image as IImage).publicId) await destroyResource(image.publicId);
    sendError(error, res);
  }
}

export async function destroy(req: Request, res: Response) {
  const { productId } = req.params;

  try {
    const product = await ProductModel.findById(productId).populate<{ categories: CategoryHydrated[] }>(
      'categories',
      'products',
    );
    if (!product) throw new NotFoundError('Producto no encontrado');

    await product.remove();

    const { categories, image } = product;
    if (categories.length) await removeProductRefInCategories(product._id, categories);
    if (image && image.publicId) await destroyResource(image.publicId);

    res.status(200).json({ product });
  } catch (error) {
    sendError(error, res);
  }
}
