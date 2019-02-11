import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";

export interface ITillDenominationsApiObject<T> extends IDenominationsApiObject<T> {
  float: T;
  visa: T;
  amex: T;
  zRead: T;
}

export interface ITillDenominationsUpdateObject<T> extends IDenominationsUpdateObject<T> {
  float?: T;
  visa?: T;
  amex?: T;
  zRead?: T;
}

export class TillDenominations extends Denominations<number> {
  public static default() {
    return new TillDenominations(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    );
  }

  public readonly float: number;
  public readonly visa: number;
  public readonly amex: number;
  public readonly zRead: number;

  constructor(visa: number, amex: number, fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, float: number, zRead: number) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.float = float;
    this.visa = visa;
    this.amex = amex;
    this.zRead = zRead;
  }

  public with(obj: ITillDenominationsUpdateObject<number>): TillDenominations {
    return Object.assign(
      new TillDenominations(this.visa, this.amex, this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.float, this.zRead),
      obj
    );
  }

  public clone(): TillDenominations {
    return this.with({});
  }

  public totalTaken(): number {
    return this.visa + this.amex + this.totalCashTaken();
  }

  private totalCashTaken(): number {
    return this.fiftyPounds + this.twentyPounds + this.tenPounds + this.fivePounds + this.pounds + this.fiftyPence + this.twentyPence + this.tenPence + this.fivePence
  }
}