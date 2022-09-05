import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import CashboxModel from 'src/models/Cashbox.model';
import UserModel from 'src/models/User.model';
import { CashboxHydrated, UserModelHydrated } from 'src/types';
import AuthError from 'src/utils/errors/AuthError';
import NotFoundError from 'src/utils/errors/NotFoundError';
import sendError from 'src/utils/sendError';

export async function list(req: Request, res: Response) {
  const { user } = req;
  const boxSelect = '-transactions -closingRecords';
  try {
    const result: CashboxHydrated[] = [];
    if (user && user?.role === 'admin') {
      const boxes = await CashboxModel.find().sort('name').select(boxSelect).populate('cashier', 'name');
      result.push(...boxes);
    } else if (user) {
      const userWithBoxes = await user.populate<{ boxes: CashboxHydrated[] }>({
        path: 'boxes',
        select: boxSelect,
        populate: {
          path: 'cashier',
          select: 'name',
        },
      });
      result.push(...userWithBoxes.boxes);
    }

    res.status(200).json({ boxes: result });
  } catch (error) {
    sendError(error, res);
  }
}

export async function store(req: Request, res: Response) {
  const { user: currentUser } = req;
  const { name, users } = req.body;
  try {
    if (!currentUser) throw new AuthError('No estas autorizado');

    const cashbox = await CashboxModel.create({ name });

    if (users && users instanceof Array && users.length > 0) {
      // Add the actual user if dont exist en the list
      const currentUserExist = users.some((userId) => {
        if (typeof userId === 'string') return currentUser._id.equals(userId);
        return false;
      });
      if (!currentUserExist) users.push(currentUser.id);

      await Promise.all(
        users.map(async (userId) => {
          if (typeof userId === 'string' && isValidObjectId(userId)) {
            const user = await UserModel.findById(userId);
            if (user) {
              cashbox.users.push(user._id);
              user.boxes.push(cashbox._id);
              await user.save({ validateBeforeSave: false });
            }
          }
        }),
      );
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
    const cashbox = await CashboxModel.findById(boxId).populate('cashier', 'name');
    if (!cashbox) throw new NotFoundError('Caja no encontrada');
    console.log(req.user?.boxes.length);
    /* if (cashbox.lastClosing) {
      await cashbox.populate({
        path: 'transactions',
        match: {
          transactionDate: { $gte: cashbox.lastClosing },
        },
      });
    } else {
      await cashbox.populate('transactions');
    } */
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

    // TODO:Delete ref of cashbox in all transactions
    // TODO:Delete ref of cashbox in all closing records

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
