import { HydratedSaleOperationWithCategories } from 'src/types';
import dayjs, { Dayjs } from 'dayjs';
import { ShortMonths } from '..';
import DailyReport from './DailyReport';
import MonthlyReport from './MonthlyReport';

export default class AnnualReport extends DailyReport {
  year: number;
  monthlyReports: MonthlyReport[];

  constructor(year: number, fromDate: Dayjs, toDate: Dayjs, saleOperations: HydratedSaleOperationWithCategories[]) {
    super(fromDate, toDate);
    this.year = year;
    this.monthlyReports = [];
    this.createMonthlyReports(saleOperations);
  }

  protected createMonthlyReports(saleOperations: HydratedSaleOperationWithCategories[]) {
    let date = this.fromDate.clone();
    let lastIndex = 0;

    while (date.isBefore(this.toDate)) {
      const startMonth = date.startOf('month');
      const endMonth = date.endOf('month');
      const month = ShortMonths[startMonth.month() + 1];
      const monthOperations: HydratedSaleOperationWithCategories[] = [];

      for (let index = lastIndex; index < saleOperations.length; index++) {
        const operation = saleOperations[index];
        const operationDate = dayjs(operation.operationDate);
        if (!(operationDate.isSameOrAfter(startMonth) && operationDate.isSameOrBefore(endMonth))) break;

        super.add(operation.amount, operation.categories);
        monthOperations.push(operation);
        lastIndex += 1;
      }

      this.monthlyReports.push(new MonthlyReport(month, startMonth, endMonth, monthOperations));
      date = date.add(1, 'month');
    }
  }
}
