import {ApiType, EntityType, InputType, UpdateType} from "../../../../State/TypeWithNumericalInputs";
import {Denominations} from "./Denominations";

export abstract class TillDenominationsAbstract<T> extends Denominations<T> {
  public readonly float: T;
  public readonly visa: T;
  public readonly amex: T;
  public readonly zRead: T;

  constructor(fiftyPounds: T, twentyPounds: T, tenPounds: T, fivePounds: T, pounds: T, fiftyPence: T, twentyPence: T, tenPence: T, fivePence: T, float: T, visa: T, amex: T, zRead: T) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.float = float;
    this.visa = visa;
    this.amex = amex;
    this.zRead = zRead;
  }
}
export type TillDenominationsApiType = ApiType<TillDenominationsAbstract<number>>;
export type TillDenominationsUpdateType = UpdateType<TillDenominationsAbstract<string>>;
export type TillDenominationsInputType = InputType<TillDenominationsAbstract<string>>;
export type TillDenominationsType = EntityType<TillDenominationsAbstract<number>, TillDenominationsAbstract<string>>;