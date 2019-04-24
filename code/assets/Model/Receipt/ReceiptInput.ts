import {ReceiptAbstract, ReceiptApiType, ReceiptUpdateType} from "./ReceiptTypes";

export class ReceiptInput extends ReceiptAbstract<string> {
  public static fromApi(obj: ReceiptApiType) {
    return new ReceiptInput(obj.description, Math.abs(obj.amount).toString(), obj.amount < 0);
  }

  public static default() {
    return new ReceiptInput('','', true);
  }

  public readonly isOutgoing: boolean;

  constructor(description: string, amount: string, isOutgoing: boolean) {
    super(description, amount);
    this.isOutgoing = isOutgoing;
  }

  public with(obj: ReceiptUpdateType): ReceiptInput {
    return new ReceiptInput(
      obj.description !== undefined ? obj.description : this.description,
      obj.amount !== undefined ? obj.amount : this.amount,
      obj.isOutgoing !== undefined ? obj.isOutgoing : this.isOutgoing,
    );
  }

  public clone(): ReceiptInput {
    return this.with({});
  }
}