import { Dayjs } from 'dayjs';
import { CategoryHydrated } from 'src/types';
import CategoryReport from './CategoryReport';
import TagReport from './TagReport';

interface IAxuliarName {
  id: string;
  name: string;
}

export default class DailyReport {
  fromDate: Dayjs;
  toDate: Dayjs;
  categories: CategoryReport[];
  tags: TagReport[];
  amount: number;
  accumulated?: number;

  constructor(fromDate: Dayjs, toDate: Dayjs) {
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.categories = [];
    this.tags = [];
    this.amount = 0;
  }

  add(amount: number, newCategories?: CategoryHydrated[], newTags?: IAxuliarName[]) {
    this.amount += amount;
    if (newCategories && newCategories.length > 0) {
      newCategories.forEach((newCategory) => {
        const existCatg = this.categories.find(({ category }) => category._id.equals(newCategory._id));
        if (existCatg) existCatg.add(amount, newTags);
        else this.categories.push(new CategoryReport(newCategory, amount, newTags));
      });
    }

    if (newTags && newTags.length > 0) {
      newTags.forEach(({ id, name }) => {
        const existTagReport = this.tags.find((report) => report.id === id);
        if (existTagReport) existTagReport.add(amount);
        else this.tags.push(new TagReport(id, name, amount));
      });
    }
  }
}
