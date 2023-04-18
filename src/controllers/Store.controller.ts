import dayjs from 'dayjs';
import { Request, Response } from 'express';
import InvoiceModel from 'src/models/Invoice.model';
import StoreModel from 'src/models/Store.model';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

export async function list(_req: Request, res: Response) {
  try {
    const storeDocuments = await StoreModel.find({}).sort('name').populate('defaultBox');
    const groupQuery = { _id: '$premiseStore', amount: { $sum: '$amount' } };

    const [monthlySales, weeklySales] = await Promise.all([
      InvoiceModel.aggregate()
        .sort('expeditionDate')
        .match({ expeditionDate: { $gte: dayjs().subtract(1, 'month').toDate() }, cancel: false })
        .group(groupQuery),
      InvoiceModel.aggregate()
        .sort('expeditionDate')
        .match({ expeditionDate: { $gte: dayjs().startOf('week').toDate() }, cancel: false })
        .group(groupQuery),
    ]);

    const stores = storeDocuments.map((document) => {
      const monthlySale = monthlySales.find((item) => document._id.equals(item._id));
      const weeklySale = weeklySales.find((item) => document._id.equals(item._id));
      const store = document.toObject();
      store.monthlySales = monthlySale ? monthlySale.amount : 0;
      store.weeklySales = weeklySale ? weeklySale.amount : 0;

      return store;
    });

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

export async function premiseStoreInvoices(_req: Request, res: Response) {
  try {
    const stores = await StoreModel.find({}).populate({
      path: 'invoices',
      match: { cancel: false },
      options: { sort: { expeditionDate: 1 } },
      select: 'expeditionDate amount cancel',
    });

    res.status(200).json(stores);
  } catch (error) {
    sendError(error, res);
  }
}
