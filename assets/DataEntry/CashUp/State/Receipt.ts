export interface IReceiptUpdateObject {
  id?: number;
  description?: string;
  amount?: number;
}

export interface IReceiptApiObject {
  id: number;
  description: string;
  amount: number;
}

export class Receipt {
  public static default() {
    return new Receipt('',0);
  }

  public readonly id?: number;
  public readonly description: string;
  public readonly amount: number;

  constructor(description: string, amount: number) {
    this.description = description;
    this.amount = amount;
  }

  public with(obj: IReceiptUpdateObject): Receipt {
    return Object.assign(new Receipt(this.description, this.amount), obj);
  }

  public clone(): Receipt {
    return this.with({});
  }
}