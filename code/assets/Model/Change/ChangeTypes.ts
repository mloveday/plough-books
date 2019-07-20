import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class ChangeAbstract<T> {
  public readonly initials: string;
  public readonly witness: string;
  public readonly amount: T;

  constructor(amount: T, initials: string, witness: string) {
    this.initials = initials;
    this.witness = witness;
    this.amount = amount;
  }
}
export type ChangeApiType = ApiType<ChangeAbstract<number>>;
export type ChangeUpdateType = UpdateType<ChangeAbstract<string> & {readonly isOutgoing: boolean;}>;
export type ChangeInputType = InputType<ChangeAbstract<string>>;
export type ChangeType = EntityType<ChangeAbstract<number>, ChangeAbstract<string>>;