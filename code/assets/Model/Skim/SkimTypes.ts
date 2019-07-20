import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class SkimAbstract<T> {
  public readonly initials: string;
  public readonly witness: string;
  public readonly amount: T;

  constructor(amount: T, initials: string, witness: string) {
    this.initials = initials;
    this.witness = witness;
    this.amount = amount;
  }
}
export type SkimApiType = ApiType<SkimAbstract<number>>;
export type SkimUpdateType = UpdateType<SkimAbstract<string> & {readonly isOutgoing: boolean;}>;
export type SkimInputType = InputType<SkimAbstract<string>>;
export type SkimType = EntityType<SkimAbstract<number>, SkimAbstract<string>>;