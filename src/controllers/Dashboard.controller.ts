import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { Request, Response } from 'express';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import { ShortMonths } from 'src/utils';
import sendError from 'src/utils/sendError';
import SaleOperationModel from 'src/models/SaleOperation.model';
import { CategoryHydrated, IDailyCreditEvolution, OperationType } from 'src/types';
import AnnualReport from 'src/utils/reports/AnnualReport';

dayjs.extend(timezone);
const tz = 'America/Bogota';

export const cashReport = async (_req: Request, res: Response) => {
  interface ICashGroupResult {
    _id: { month: number; year: number };
    incomes: number;
    expenses: number;
    balance: number;
  }

  interface ICashMonthReport {
    month: string;
    year: number;
    incomes: number | null;
    averageIncomes: number | null;
    annualAverageIncomes: number;
    sumIncomes: number;
    expenses: number | null;
    averageExpenses: number | null;
    annualAverageExpenses: number;
    sumExpenses: number;
    balance: number | null;
    sumBalance: number;
  }

  const buildCashReport = (data: ICashGroupResult[], year = dayjs().year()): ICashMonthReport[] => {
    const reports: ICashMonthReport[] = [];

    let sumIncomes = 0;
    let incomeCount = 0;
    let averageIncomes: number | null = null;
    let annualAverageIncomes = 0;

    let sumExpenses = 0;
    let annualAverageExpenses = 0;
    let averageExpenses: number | null = null;
    let expenseCount = 0;

    let sumBalance = 0;

    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      const month = ShortMonths[monthIndex];
      let incomes: number | null = null;
      let expenses: number | null = null;
      let balance: number | null = null;

      const reportData = data.find((item) => item._id.month === monthIndex && item._id.year === year);
      if (reportData) {
        if (reportData.incomes) {
          incomes = reportData.incomes;
          sumIncomes += incomes;

          incomeCount += 1;
          averageIncomes = sumIncomes / incomeCount;
        }
        if (reportData.expenses) {
          expenses = reportData.expenses * -1;
          sumExpenses += expenses;

          expenseCount += 1;
          averageExpenses = sumExpenses / expenseCount;
        }

        balance = reportData.balance;
        sumBalance += balance;
      }

      annualAverageIncomes = sumIncomes / monthIndex;
      annualAverageExpenses = sumExpenses / monthIndex;

      reports.push({
        month,
        year,
        incomes,
        averageIncomes,
        annualAverageIncomes,
        sumIncomes,
        expenses,
        averageExpenses,
        annualAverageExpenses,
        sumExpenses,
        balance,
        sumBalance,
      });
    }

    return reports;
  };

  try {
    const now = dayjs();
    const startYear = now.clone().startOf('year').toDate();
    const endYear = now.clone().endOf('year').toDate();

    const result = await CashboxTransactionModel.aggregate<ICashGroupResult>()
      .sort('transactionDate')
      .match({ transactionDate: { $gte: startYear, $lte: endYear } })
      .project({
        date: {
          $dateSubtract: {
            startDate: '$transactionDate',
            unit: 'hour',
            amount: 5,
          },
        },
        amount: true,
      })
      .group({
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        incomes: {
          $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] },
        },
        expenses: {
          $sum: { $cond: [{ $lt: ['$amount', 0] }, '$amount', 0] },
        },
        balance: { $sum: '$amount' },
      });

    const reports = buildCashReport(result);

    res.status(200).json({ reports });
  } catch (error) {
    sendError(error, res);
  }
};

// ----------------------------------------------------------------------------
// ANNUAL REPORTS
// ----------------------------------------------------------------------------

const getOperationSales = async (from: Dayjs, to: Dayjs, type: OperationType) => {
  const result = await SaleOperationModel.find({
    operationDate: { $gte: from, $lt: to },
    operationType: type,
  })
    .sort('operationDate')
    .populate<{ categories: CategoryHydrated[] }>('categories', 'mainCategory name level subcategories');

  return result;
};

const isOperationType = (value: any): value is OperationType => {
  const types = ['sale', 'purchase', 'credit', 'separate', 'credit_payment', 'separate_payment', 'exchange'];
  return types.includes(value);
};

const getAnnualReport = async (operationType: OperationType, year?: number): Promise<AnnualReport> => {
  const now = dayjs().tz(tz);
  let fromDate = now.startOf('year');
  let toDate = now.endOf('year');

  if (year && !isNaN(year)) {
    fromDate = fromDate.year(Number(year));
    toDate = fromDate.endOf('year');
    if (toDate.isAfter(now)) toDate = now.clone();
  }

  const operations = await getOperationSales(fromDate, toDate, operationType);
  return new AnnualReport(fromDate.year(), fromDate, toDate, operations);
};

export const annualReport = async (req: Request, res: Response) => {
  const { year, operation } = req.query;
  const operationType: OperationType = isOperationType(operation) ? operation : 'sale';

  try {
    const report = await getAnnualReport(operationType, Number(year));
    res.status(200).json({ report });
  } catch (error) {
    sendError(error, res);
  }
};

export const creditEvolution = async (_req: Request, res: Response) => {
  try {
    const date = dayjs().tz(tz).startOf('year').toDate();
    let initialBalance = 0;

    const initialSums = await SaleOperationModel.aggregate<{ credits: number; payments: number }>()
      .sort('operationsDate')
      .match({
        operationDate: { $lt: date },
        operationType: { $in: ['credit', 'credit_payment'] },
      })
      .group({
        _id: null,
        credits: { $sum: { $cond: [{ $eq: ['$operationType', 'credit'] }, '$amount', 0] } },
        payments: { $sum: { $cond: [{ $eq: ['$operationType', 'credit_payment'] }, '$amount', 0] } },
      });

    const dailyResume = await SaleOperationModel.aggregate<{
      _id: { year: number; month: number; day: number };
      credits: number;
      payments: number;
    }>()
      .sort('operationDate')
      .match({
        operationDate: { $gte: date },
        operationType: { $in: ['credit', 'credit_payment'] },
      })
      .group({
        _id: {
          year: { $year: '$operationDate' },
          month: { $month: '$operationDate' },
          day: { $dayOfMonth: '$operationDate' },
        },
        credits: { $sum: { $cond: [{ $eq: ['$operationType', 'credit'] }, '$amount', 0] } },
        payments: { $sum: { $cond: [{ $eq: ['$operationType', 'credit_payment'] }, '$amount', 0] } },
      });

    if (initialSums.length > 0) {
      const { credits, payments } = initialSums[0];
      initialBalance = credits - payments;
    }

    const dailyReports: IDailyCreditEvolution[] = [];

    dailyResume.forEach(({ _id, credits, payments }) => {
      const { year, month, day } = _id;
      const date = dayjs(`${year}-${month}-${day}`).tz(tz).startOf('day').toDate();
      const balance = credits - payments;

      dailyReports.push({ date, credits, payments, balance });
    });

    res.status(200).json({ initialBalance, dailyReports, dailyResume });
  } catch (error) {
    sendError(error, res);
  }
};
