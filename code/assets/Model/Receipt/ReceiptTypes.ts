import {ApiType, EntityType, InputType, UpdateType} from "../../State/TypeWithNumericalInputs";

export abstract class ReceiptAbstract<T> {
  public readonly description: string;
  public readonly amount: T;

  constructor(description: string, amount: T) {
    this.description = description;
    this.amount = amount;
  }
}
export type ReceiptApiType = ApiType<ReceiptAbstract<number>>;
export type ReceiptUpdateType = UpdateType<ReceiptAbstract<string>>;
export type ReceiptInputType = InputType<ReceiptAbstract<string>>;
export type ReceiptType = EntityType<ReceiptAbstract<number>, ReceiptAbstract<string>>;