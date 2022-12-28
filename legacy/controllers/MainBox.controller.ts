import dayjs from 'dayjs';
import { Request, Response } from 'express';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import CashClosingRecordModel from 'src/models/CashClosingRecord.model';
import CashboxError from 'src/utils/errors/CashboxError';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

export async function transactionList(_req: Request, res: Response) {
  try {
    const transactions = await CashboxTransactionModel.find().populate('cashbox', 'name').sort('transactionDate');
    res.status(200).json({ transactions });
  } catch (error) {
    sendError(error, res);
  }
}

export async function closingList(_req: Request, res: Response) {
  try {
    const closings = await CashClosingRecordModel.find()
      .populate('cashbox', 'name')
      .populate('user', 'name')
      .populate('cashier', 'name')
      .sort('closingDate');

    res.status(200).json({ closings });
  } catch (error) {
    sendError(error, res);
  }
}

export async function closingTransactions(req: Request, res: Response) {
  const { closingId } = req.params;
  try {
    const closing = await CashClosingRecordModel.findById(closingId).populate('transactions');
    if (!closing) throw new NotFoundError('Cierre no encontrado');

    res.status(200).json({ transactions: closing.transactions });
  } catch (error) {
    sendError(error, res);
  }
}

export async function addTransaction(req: Request, res: Response) {
  const { date, description, amount } = req.body;

  try {
    let transactionDate = dayjs();
    if (date && typeof date === 'string' && dayjs(date).isValid() && dayjs(date).isBefore(transactionDate)) {
      transactionDate = dayjs(date);
    }

    const transaction = await CashboxTransactionModel.create({
      transactionDate,
      description,
      amount,
    });

    res.status(201).json({ transaction });
  } catch (error) {
    sendError(error, res);
  }
}

export async function destroyTransaction(req: Request, res: Response) {
  const { transactionId } = req.params;
  try {
    const transaction = await CashboxTransactionModel.findById(transactionId);
    if (!transaction) throw new NotFoundError('Transacción no encontrada');

    if (transaction.isTransfer) throw new CashboxError('Las transferencias no pueden eliminarse');
    await transaction.remove();

    res.status(200).json({ transaction });
  } catch (error) {
    sendError(error, res);
  }
}
