import { Request, Response } from 'express';
import StoreModel from 'src/models/Store.model';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

export async function list(_req: Request, res: Response) {
  try {
    const stores = await StoreModel.find({}).sort('name').populate('defaultBox');
    res.status(200).json(stores);
  } catch (error) {
    sendError(error, res);
  }
}

export async function store(req: Request, res: Response) {
  const { name, phone, address, defaultBox } = req.body;
  try {
    const newStore = await StoreModel.create({ name, phone, address, defaultBox });
    await newStore.populate('defaultBox');
    res.status(201).json(newStore);
  } catch (error) {
    sendError(error, res);
  }
}

export async function update(req: Request, res: Response) {
  const { name, phone, address, defaultBox } = req.body;
  const { storeId } = req.params;

  const commercialPremise = await StoreModel.findById(storeId);
  if (!commercialPremise) throw new NotFoundError('Local no existe o fue eliminado');

  try {
    commercialPremise.name = name;
    commercialPremise.phone = phone;
    commercialPremise.address = address;
    commercialPremise.defaultBox = defaultBox;

    await commercialPremise.save({ validateModifiedOnly: true });
    await commercialPremise.populate('defaultBox');

    res.status(200).json(commercialPremise);
  } catch (error) {
    sendError(error, res);
  }
}
