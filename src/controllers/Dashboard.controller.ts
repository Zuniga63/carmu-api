import dayjs from 'dayjs';
import { Request, Response } from 'express';
import CashboxTransactionModel from 'src/models/CashboxTransaction.model';
import { ShortMonths } from 'src/utils';
import sendError from 'src/utils/sendError';

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
