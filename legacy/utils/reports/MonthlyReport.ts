import dayjs, { Dayjs } from 'dayjs';
import { HydratedSaleOperationWithCategories } from 'src/types';
import DailyReport from './DailyReport';

export default class MonthlyReport extends DailyReport {
  name: string;
  dailyReports: DailyReport[];

  constructor(name: string, fromDate: Dayjs, toDate: Dayjs, saleOperations: HydratedSaleOperationWithCategories[]) {
    super(fromDate, toDate);
    this.name = name;
    this.dailyReports = [];
    this.createDailyReports(saleOperations);
  }

  protected createDailyReports(saleOperations: HydratedSaleOperationWithCategories[]) {
    let date = this.fromDate.clone();
    let lastIndex = 0;

    while (date.isSameOrBefore(this.toDate)) {
      const startDay = date.startOf('day');
      const endDay = date.endOf('day');
      const dailyReport = new DailyReport(startDay, endDay);

      for (let index = lastIndex; index < saleOperations.length; index += 1) {
        const operation = saleOperations[index];
        const operationDate = dayjs(operation.operationDate);
        if (!(operationDate.isSameOrAfter(startDay) && operationDate.isSameOrBefore(endDay))) break;

        super.add(operation.amount, operation.categories);
        dailyReport.add(operation.amount, operation.categories);
        lastIndex += 1;
      }

      if (dailyReport.amount > 0) this.dailyReports.push(dailyReport);
      date = date.add(1, 'day');
    }
  }

  addDailyReport(dailyReport: DailyReport) {
    this.dailyReports.push(dailyReport);
  }
}
