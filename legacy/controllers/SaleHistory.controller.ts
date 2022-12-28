import dayjs from 'dayjs';
import { Request, Response } from 'express';
import SaleOperationModel from 'src/models/SaleOperation.model';
import sendError from 'src/utils/sendError';

export const list = async (req: Request, res: Response) => {
  const { from, to } = req.query;
  try {
    let fromDate = dayjs().startOf('day');
    let toDate = dayjs().endOf('day');

    if (from && typeof from === 'string' && dayjs(from).isValid()) fromDate = dayjs(from);
    if (to && typeof to === 'string' && dayjs(to).isValid() && fromDate.isBefore(to)) toDate = dayjs(to);

    const result = await SaleOperationModel.find({
      operationDate: { $gte: fromDate.toDate(), $lte: toDate.toDate() },
    }).sort('operationDate');

    res.status(200).json({ history: result });
  } catch (error) {
    sendError(error, res);
  }
};
