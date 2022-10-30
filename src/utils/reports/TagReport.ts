export default class TagReport {
  id: string;
  name: string;
  amount: number;

  constructor(id: string, name: string, amount = 0) {
    this.id = id;
    this.name = name;
    this.amount = amount;
  }

  add(value: number) {
    this.amount += value;
  }
}
