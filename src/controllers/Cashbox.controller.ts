import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import dayjs from 'dayjs';
import CashboxModel from 'src/models/Cashbox.model';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import UserModel from 'src/models/User.model';
import { CashboxHydrated, CashboxTransactionHydrated, IValidationErrors, UserModelHydrated } from 'src/types';
import AuthError from 'src/utils/errors/AuthError';
import NotFoundError from 'src/utils/errors/NotFoundError';
import ValidationError from 'src/utils/errors/ValidationError';
import sendError from 'src/utils/sendError';
import CashboxError from 'src/utils/errors/CashboxError';
import CashClosingRecordModel from 'src/models/CashClosingRecord.model';

export async function list(req: Request, res: Response) {
  const { user } = req;
  const boxSelect = '-transactions -closingRecords';
  let boxes: CashboxHydrated[] = [];

  try {
    // * If the user is admin can view all boxes
    if (user && user?.role === 'admin') {
      boxes = await CashboxModel.find().sort('name').select(boxSelect).populate('cashier', 'name');
    } else if (user) {
      const userWithBoxes = await user.populate<{ boxes: CashboxHydrated[] }>({
        path: 'boxes',
        select: boxSelect,
        populate: {
          path: 'cashier',
          select: 'name',
        },
      });

      boxes = userWithBoxes.boxes;
    }
    res.status(200).json({ boxes });
  } catch (error) {
    sendError(error, res);
  }
}

export async function store(req: Request, res: Response) {
  const { user: currentUser } = req;
  const { name, userIds } = req.body;

  try {
    if (!currentUser) throw new AuthError('No estas autorizado');

    const cashbox = new CashboxModel({ name });

    if (userIds && userIds instanceof Array && userIds.length > 0) {
      // Verify pass only ids string and valid object id
      const IDs = userIds.filter((item) => typeof item === 'string' && isValidObjectId(item));

      // Add the actual user if dont exist on the list
      const currentUserExist = IDs.some((userId) => currentUser._id.equals(userId));
      if (!currentUserExist) IDs.push(currentUser.id);

      // Update ecah user
      const users = (await Promise.all(IDs.map((userId) => UserModel.findById(userId)))).filter((item) => !!item);
      users.forEach((user) => {
        if (user) {
          cashbox.users.push(user._id);
          user.boxes.push(cashbox._id);
        }
      });
      await Promise.all(users.map((user) => user?.save({ validateBeforeSave: false })));
    } else {
      cashbox.users.push(currentUser._id);
      currentUser.boxes.push(cashbox._id);
      await currentUser.save({ validateBeforeSave: false });
    }

    await cashbox.save({ validateBeforeSave: false });

    res.status(201).json({ cashbox });
  } catch (error) {
    sendError(error, res);
  }
}

/**
 * !Pendient for resolve
 * @param req
 * @param res
 */
export async function show(req: Request, res: Response) {
  const { boxId } = req.params;
  try {
    const cashbox = await CashboxModel.findById(boxId)
      .populate('cashier', 'name')
      .populate('transactions')
      .populate('closingRecords');
    if (!cashbox) throw new NotFoundError('Caja no encontrada');
    res.status(200).json({ cashbox });
  } catch (error) {
    sendError(error, res);
  }
}

export async function update(req: Request, res: Response) {
  const { boxId } = req.params;
  const { name } = req.body;

  try {
    const cashbox = await CashboxModel.findById(boxId).select('_id name');
    if (!cashbox) throw new NotFoundError('Caja no encontrada.');

    if (typeof name === 'string' && cashbox.name !== name.trim()) {
      cashbox.name = name.trim();
      await cashbox.save({ validateModifiedOnly: true });
    }

    res.status(200).json({ cashbox });
  } catch (error) {
    sendError(error, res);
  }
}

export async function destroy(req: Request, res: Response) {
  const { boxId } = req.params;

  try {
    const cashbox = await CashboxModel.findById(boxId);
    if (!cashbox) throw new NotFoundError('Caja no encontrada.');
    if (cashbox.openBox) throw new CashboxError('La caja no se puede eliminar si está abierta.');

    // Delete ref of cashbox in all transactions
    await CashboxTransactionModel.updateMany({ cashbox: cashbox._id }, { cashbox: null });
    // Delete ref of cashbox in all closing records
    await CashClosingRecordModel.updateMany({ cashbox: cashbox._id }, { cashbox: null });

    // *Delete ref of cashbox in the users
    const users = await Promise.all(cashbox.users.map((userId) => UserModel.findById(userId).select('_id boxes')));
    const usersModified: UserModelHydrated[] = [];

    users.forEach((user) => {
      if (user) {
        const { boxes } = user;
        user.boxes = boxes.filter((boxId) => !cashbox._id.equals(boxId));
        usersModified.push(user);
      }
    });

    await cashbox.remove();
    await Promise.all(usersModified.map((user) => user.save({ validateBeforeSave: false })));

    res.status(200).json({ cashbox: { id: cashbox.id, name: cashbox.name } });
  } catch (error) {
    sendError(error, res);
  }
}

export async function openBox(req: Request, res: Response) {
  const { boxId } = req.params;
  const { cashierId, base } = req.body;
  const errors: IValidationErrors = {};
  let hasError = false;

  try {
    // ------------------------------------------------------------------------
    // VALIDATION FIELDS
    // ------------------------------------------------------------------------
    // Validate Box Id
    if (!isValidObjectId(boxId)) {
      errors.boxId = { name: 'boxId', message: 'ID de la caja invalido.' };
      hasError = true;
    }

    // Validate User Id
    if (cashierId) {
      if (!isValidObjectId(cashierId)) {
        errors.cashierId = { name: 'cashierId', message: 'El ID del cajero es invalido.' };
        hasError = true;
      }
    } else {
      errors.cashierId = { name: 'cashierId', message: 'Se requiere un cajero para abrir la caja.' };
      hasError = true;
    }
    // Validate base
    if (base) {
      if (typeof base !== 'number') {
        errors.base = { name: 'base', message: 'No tiene un formato válido.' };
        hasError = true;
      } else if (base < 0) {
        errors.base = { name: 'base', message: 'No puede ser menor que cero.' };
        hasError = true;
      }
    } else {
      errors.base = { name: 'base', message: 'La base es requerida.' };
      hasError = true;
    }

    if (hasError) throw new ValidationError('Error de Validación', errors);

    // Get the cashbox and cashier
    const [cashbox, cashier] = await Promise.all([CashboxModel.findById(boxId), UserModel.findById(cashierId)]);
    if (!cashbox) throw new NotFoundError('Caja a iniciar no encontrada');
    if (!cashier) throw new NotFoundError('Usuario no encontrado');
    if (cashbox.openBox) throw new CashboxError('¡La caja ya está abierta!');

    // ------------------------------------------------------------------------
    // OPEN BOX
    // ------------------------------------------------------------------------

    cashbox.cashier = cashier._id;
    cashbox.cashierName = cashier.name;
    cashbox.base = base;
    cashbox.openBox = dayjs().toDate();
    cashbox.closed = undefined;
    const cashboxSaved = await cashbox.save({ validateBeforeSave: false });

    res.status(200).json({ cashbox: cashboxSaved });
  } catch (error) {
    sendError(error, res);
  }
}

export async function closeBox(req: Request, res: Response) {
  const { boxId } = req.params;
  const { cash, observation } = req.body;
  const errors: IValidationErrors = {};
  let hasError = false;

  let incomes = 0;
  let expenses = 0;
  let balance: number;
  let leftover: number | undefined;
  let missing: number | undefined;
  const transactions: CashboxTransactionHydrated[] = [];

  try {
    // Validate cash value
    if (cash) {
      if (typeof cash !== 'number') {
        errors.cash = { name: 'cash', message: 'No tiene un formato válido.' };
        hasError = true;
      } else if (cash < 0) {
        errors.base = { name: 'base', message: 'No puede ser menor que cero.' };
        hasError = true;
      }
    } else {
      errors.cash = { name: 'cash', message: 'Se requiere el conteo de la caja.' };
      hasError = true;
    }

    if (hasError) throw new ValidationError('Error de validación', errors);

    // Get the cashbox with transctions and cashier
    const cashbox = await CashboxModel.findById(boxId)
      .populate<{ transactions: CashboxTransactionHydrated[] }>('transactions')
      .populate<{ cashier: UserModelHydrated | undefined | null }>('cashier');
    if (!cashbox) throw new NotFoundError('Caja no encontrada');
    if (!cashbox.openBox) throw new CashboxError('¡La caja no está abierta!');

    // Calculate the incomes and expenses
    cashbox.transactions.forEach((transaction) => {
      transaction.cashbox = undefined;
      if (transaction.amount > 0) incomes += transaction.amount;
      else expenses += Math.abs(transaction.amount);

      transactions.push(transaction);
    });

    // Calculate the balance of box, leftover and missing
    balance = cashbox.base + incomes - expenses;
    if (balance !== cash) {
      const transactionDate = dayjs().toDate();
      const amount = cash - balance;
      let description: string;

      if (balance < cash) {
        leftover = cash - balance;
        description = `Sobrante de la caja `;
      } else {
        missing = balance - cash;
        description = `Faltante de la caja `;
      }

      description += `"${cashbox.name}" a cargo de "${cashbox.cashier?.name}"`;
      const transaction = await CashboxTransactionModel.create({ transactionDate, description, amount });
      transactions.push(transaction);
    }

    // Create the closing
    const closing = await CashClosingRecordModel.create({
      cashbox: cashbox._id,
      user: req.user?._id,
      cashier: cashbox.cashier?._id,
      username: req.user?.name,
      cashierName: cashbox.cashier?.name || cashbox.cashierName,
      boxName: cashbox.name,
      opened: cashbox.openBox,
      closingDate: dayjs().toDate(),
      base: cashbox.base,
      incomes: incomes !== 0 ? incomes : undefined,
      expenses: expenses !== 0 ? expenses : undefined,
      cash,
      leftover,
      missing,
      transactions,
      observation,
    });

    // Restore the box
    cashbox.cashier = undefined;
    cashbox.base = 0;
    cashbox.openBox = undefined;
    cashbox.closed = dayjs().toDate();
    cashbox.transactions = [];
    cashbox.closingRecords.push(closing._id);
    await cashbox.save({ validateBeforeSave: false });
    await Promise.all(transactions.map((item) => item.save({ validateBeforeSave: false })));

    res.status(200).json({ cashbox, closing });
  } catch (error) {
    sendError(error, res);
  }
}

export async function listTransactions(req: Request, res: Response) {
  const { boxId } = req.params;
  try {
    const transactions = await CashboxTransactionModel.find({ cashbox: boxId }).sort('transactionDate');
    res.status(200).json({ transactions });
  } catch (error) {
    sendError(error, res);
  }
}

export async function addTransaction(_req: Request, res: Response) {
  // const { boxid } = req.params;
  try {
    // TODO
  } catch (error) {
    sendError(error, res);
  }
}

export async function updateTransaction(_req: Request, res: Response) {
  // const { boxid } = req.params;
  try {
    // TODO
  } catch (error) {
    sendError(error, res);
  }
}

export async function destroyTransaction(_req: Request, res: Response) {
  // const { boxid } = req.params;
  try {
    // TODO
  } catch (error) {
    sendError(error, res);
  }
}
