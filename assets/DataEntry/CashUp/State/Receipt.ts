import {validateCash} from "../../../Util/Validation";
import {ReceiptInput} from "./ReceiptInput";
import {ReceiptAbstract, ReceiptApiType, ReceiptType, ReceiptUpdateType} from "./ReceiptTypes";

export class Receipt extends ReceiptAbstract<number> implements ReceiptType {
  public static parseApiResponse(obj: ReceiptApiType) {
    return new Receipt(obj.description, obj.amount, ReceiptInput.parseApiResponse(obj), obj.id);
  }

  public static default() {
    return new Receipt('',0, ReceiptInput.default());
  }

  public readonly id?: number;
  public readonly inputs: ReceiptInput;

  constructor(description: string, amount: number, inputs: ReceiptInput, id?: number) {
    super(description, amount);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: ReceiptUpdateType): Receipt {
    return new Receipt(
      obj.description ? obj.description : this.description,
      obj.amount ? validateCash(obj.amount, this.amount) : this.amount,
      this.inputs.with(obj),
      this.id,
    );
  }

  public clone(): Receipt {
    return this.with({});
  }
}