import { Request, Response } from 'express';
import { destroyResource } from 'src/middleware/formData';
import CategoryModel from 'src/models/Category.model';
import { StoreCategoryRequest } from 'src/types';
import sendError from 'src/utils/sendError';

export async function list(_req: Request, res: Response) {
  try {
    const categories = await CategoryModel.find().sort('name');
    res.status(200).json({ categories });
  } catch (error) {
    sendError(error, res);
  }
}

export async function store(req: Request, res: Response) {
  const { name, description, image }: StoreCategoryRequest = req.body;
  try {
    // get the count of category in databse
    const count = await CategoryModel.count();

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

export async function show(_req: Request, res: Response) {
  try {
    //
  } catch (error) {
    sendError(error, res);
  }
}

export async function update(_req: Request, res: Response) {
  try {
    //
  } catch (error) {
    sendError(error, res);
  }
}

export async function destroy(_req: Request, res: Response) {
  try {
    //
  } catch (error) {
    sendError(error, res);
  }
}
