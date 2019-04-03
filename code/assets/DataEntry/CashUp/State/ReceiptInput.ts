import {ReceiptAbstract, ReceiptApiType, ReceiptUpdateType} from "./ReceiptTypes";

export class ReceiptInput extends ReceiptAbstract<string> {
  public static parseApiResponse(obj: ReceiptApiType) {
    return new ReceiptInput(obj.description, obj.amount.toString());
  }

  public static default() {
    return new ReceiptInput('','');
  }

  public with(obj: ReceiptUpdateType): ReceiptInput {
    return new ReceiptInput(
      obj.description ? obj.description : this.description,
      obj.amount ? obj.amount : this.amount
    );
  }

  public clone(): ReceiptInput {
    return this.with({});
  }
}