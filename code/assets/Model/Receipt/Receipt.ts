import * as moment from "moment";
import {validateCash} from "../../Util/Validation";
import {ReceiptInput} from "./ReceiptInput";
import {ReceiptAbstract, ReceiptApiType, ReceiptType, ReceiptUpdateType} from "./ReceiptTypes";

export class Receipt extends ReceiptAbstract<number> implements ReceiptType {
  public static fromApi(obj: ReceiptApiType) {
    return new Receipt(obj.description, obj.amount, ReceiptInput.fromApi(obj), moment.utc().unix(), obj.id);
  }

  public static default() {
    return new Receipt('', 0, ReceiptInput.default(), moment.utc().unix());
  }

  public readonly id?: number;
  public readonly timestamp: number;
  public readonly inputs: ReceiptInput;

  constructor(description: string, amount: number, inputs: ReceiptInput, timestamp: number, id?: number) {
    super(description, amount);
    this.inputs = inputs;
    this.timestamp = timestamp;
    this.id = id;
  }

  public with(obj: ReceiptUpdateType): Receipt {
    const isOutgoing = obj.isOutgoing !== undefined ? obj.isOutgoing : this.inputs.isOutgoing;
    const amount = obj.amount !== undefined ? validateCash(obj.amount, this.amount) : this.amount;

    return new Receipt(
      obj.description !== undefined ? obj.description : this.description,
      (isOutgoing ? -1 : 1) * Math.abs(amount),
      this.inputs.with(obj),
      this.timestamp,
      this.id
    );
  }

  public clone(): Receipt {
    return this.with({});
  }
}