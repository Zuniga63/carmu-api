import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { CreateCashboxDto } from './dto/create-cashbox.dto';
import { UpdateCashboxDto } from './dto/update-cashbox.dto';
import {
  CashClosingRecord,
  CashClosingRecordDocument,
} from './schemas/cash-closing-record.schema';
import {
  CashboxTransaction,
  CashboxTransactionDocument,
} from './schemas/cashbox-transaction.schema';
import { Cashbox, CashboxDocument } from './schemas/cashbox.schema';

@Injectable()
export class CashboxsService {
  constructor(
    @InjectModel(Cashbox.name) private cashboxModel: Model<CashboxDocument>,
    @InjectModel(CashboxTransaction.name)
    private transactionModel: Model<CashboxTransactionDocument>,
    @InjectModel(CashClosingRecord.name)
    private closingModel: Model<CashClosingRecordDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  // --------------------------------------------------------------------------
  // UTILS
  // --------------------------------------------------------------------------
  /**
   * This method validates thath they are valid mongose ids and remove duplicates.
   * @param userIds
   * @returns
   */
  protected getUniqueIds(userIds?: string[], currentUserId?: string): string[] {
    const ids = userIds
      ? [
          ...new Set(
            userIds
              .filter((id) => isValidObjectId(id))
              .map((id) => id.toLocaleLowerCase())
          ),
        ]
      : [];

    if (currentUserId && !ids.includes(currentUserId)) {
      ids.push(currentUserId);
    }

    return ids;
  }

  /**
   * This method get the users with their ids and repéctive boxes.
   * @param userIds
   * @param user
   * @returns
   */
  protected async getUsers(userIds?: string[], user?: User) {
    // Validate IDs and remove duplicate
    const ids = this.getUniqueIds(userIds, user?.id);

    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .select('boxes');

    return users.filter((item) => Boolean(item)) as UserDocument[];
  }

  protected async getUsersWithPopulateBoxes(userIds?: string[], user?: User) {
    const ids = this.getUniqueIds(userIds, user?.id);
    const users = await this.userModel
      .find({ _id: { $in: ids } })
      .select('boxes')
      .populate('boxes', '_id');

    return users.filter((user) => Boolean(user)) as UserDocument[];
  }

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------

  async create(createCashboxDto: CreateCashboxDto, user: User) {
    const { name, userIds } = createCashboxDto;
    const users = await this.getUsers(userIds, user);
    const cashbox = await this.cashboxModel.create({ name, users });

    // Add the new box to the users
    await Promise.all(
      users.map((user) => {
        user?.boxes.push(cashbox);
        return user?.save({ validateBeforeSave: false });
      })
    );

    return cashbox;
  }

  async findAll(user: User) {
    // Get the cashboxes that the user can see
    const filter = user.isAdmin ? {} : { users: user.id };

    const boxes = await this.cashboxModel
      .find(filter)
      .sort('name')
      .populate('cashier', 'name');

    // For each casbox, the sum of the transactions is recovered
    const sums = await this.transactionModel
      .aggregate<{
        _id: Types.ObjectId | null;
        amount: number;
      }>()
      .match({
        cashbox: { $in: boxes.map((item) => item._id) },
      })
      .group({ _id: '$cashbox', amount: { $sum: '$amount' } });

    // Update the balance of each box
    return boxes.map((boxItem) => {
      const sum = sums.find((sumItem) => sumItem._id?.equals(boxItem._id));
      const box = boxItem.toObject();
      box.balance += sum?.amount || 0;
      return box;
    });
  }

  async findOne(id: string, user: User) {
    const filter = user.isAdmin ? { _id: id } : { _id: id, users: user.id };

    const boxDocument = await this.cashboxModel
      .findOne(filter)
      .populate('cashier', 'name')
      .populate({
        path: 'users',
        select: 'name',
        options: { sort: { name: 1 } },
      })
      .populate({
        path: 'transactions',
        options: { sort: { transactionDate: 1 } },
      })
      .populate({
        path: 'closingRecords',
        select:
          'cashierName opened closingDate base incomes cash leftover observation',
        options: { sort: { closingDate: -1 }, limit: 10 },
      });

    if (!boxDocument) {
      throw new NotFoundException('Caja no encontrada');
    }

    // Update the box balance
    const box = boxDocument.toObject();
    box.transactions.forEach((t) => {
      box.balance += t.amount;
    });

    return box;
  }

  async update(id: string, updateCashboxDto: UpdateCashboxDto, user?: User) {
    const { name, userIds } = updateCashboxDto;
    const updates: Promise<any>[] = [];

    const boxDocument = await this.cashboxModel
      .findById(id)
      .populate('transactions', 'amount')
      .populate('users', '_id');

    if (!boxDocument) {
      throw new NotFoundException('Caja no encontrada');
    }

    if (name) {
      boxDocument.name = name;
    }

    if (userIds) {
      const [newUsers, currentUsers] = await Promise.all([
        this.getUsersWithPopulateBoxes(userIds, user),
        this.getUsersWithPopulateBoxes(boxDocument.users.map(({ id }) => id)),
      ]);

      // Add cashbox to new user
      newUsers.forEach((newUser) => {
        if (!currentUsers.some(({ id }) => id === newUser.id)) {
          newUser.boxes.push(boxDocument);
          updates.push(newUser.save({ validateBeforeSave: false }));
        }
      });

      // Remove cashbox to the curren user
      currentUsers.forEach((currentUser) => {
        if (!newUsers.some(({ id }) => currentUser.id === id)) {
          const { boxes } = currentUser;
          currentUser.boxes = boxes.filter(({ id }) => id !== boxDocument.id);
          updates.push(currentUser.save({ validateBeforeSave: false }));
        }
      });

      boxDocument.users = newUsers;
    }

    updates.push(boxDocument.save({ validateModifiedOnly: true }));

    // await boxDocument.save({ validateModifiedOnly: true });
    await Promise.all(updates);

    const boxBalance = boxDocument.transactions.reduce(
      (balance, { amount }) => balance + amount,
      boxDocument.base
    );

    boxDocument.depopulate('transactions').depopulate('users');

    const box = boxDocument.toObject();
    box.balance = boxBalance;

    return box;
  }

  async remove(id: string) {
    const promises: Promise<any>[] = [];
    const cashbox = await this.cashboxModel.findById(id);

    if (!cashbox) {
      throw new NotFoundException('Caja no encontrada');
    }

    if (cashbox.openBox) {
      throw new BadRequestException('La caja debe cerrarse primero');
    }

    // Remove box from each user
    const boxUsers = await this.userModel
      .find({ _id: { $in: cashbox.users } })
      .select('boxes')
      .populate('boxes', '_id');

    boxUsers.forEach((boxUser) => {
      boxUser.boxes = boxUser.boxes.filter(({ id }) => id !== cashbox.id);
      promises.push(boxUser.save({ validateBeforeSave: false }));
    });

    // delete the box
    promises.push(cashbox.remove());

    await Promise.all(promises);

    return cashbox;
  }
}
