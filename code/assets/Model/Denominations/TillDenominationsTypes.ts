import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";
import {DenominationsAbstract} from "./DenominationsAbstract";

export abstract class TillDenominationsAbstract<T> extends DenominationsAbstract<T> {
  public readonly float_amnt: T;
  public readonly visa: T;
  public readonly amex: T;
  public readonly zRead: T;
  public readonly coins: T;

  constructor(fiftyPounds: T, twentyPounds: T, tenPounds: T, fivePounds: T, pounds: T, fiftyPence: T, twentyPence: T, tenPence: T, fivePence: T, float: T, visa: T, amex: T, zRead: T, coins: T) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.float_amnt = float;
    this.visa = visa;
    this.amex = amex;
    this.zRead = zRead;
    this.coins = coins;
  }
}
export type TillDenominationsApiType = ApiType<TillDenominationsAbstract<number>>;
export type TillDenominationsUpdateType = UpdateType<TillDenominationsAbstract<string>>;
export type TillDenominationsInputType = InputType<TillDenominationsAbstract<string>>;
export type TillDenominationsType = EntityType<TillDenominationsAbstract<number>, TillDenominationsAbstract<string>>;