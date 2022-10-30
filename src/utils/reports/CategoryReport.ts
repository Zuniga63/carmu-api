import { CategoryHydrated } from 'src/types';
import TagReport from './TagReport';

export interface ITag {
  id: string;
  name: string;
}

export default class CategoryReport {
  category: CategoryHydrated;
  amount: number;
  tags: TagReport[];

  constructor(category: CategoryHydrated, amount = 0, tags?: ITag[]) {
    this.category = category;
    this.amount = amount;
    this.tags = [];

    if (amount > 0 && tags && tags.length > 0) {
      tags.forEach(({ id, name }) => {
        this.tags?.push(new TagReport(id, name, amount));
      });
    }
  }

  add(amount: number, newTags?: ITag[]) {
    this.amount += amount;

    if (newTags && newTags.length > 0) {
      newTags.forEach((newTag) => {
        const registerTag = this.tags.find((item) => item.id === newTag.id);
        if (registerTag) registerTag.add(amount);
        else this.tags.push(new TagReport(newTag.id, newTag.name, amount));
      });
    }
  }
}
