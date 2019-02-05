import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";

export interface ITillDenominationsApiObject extends IDenominationsApiObject {
  float: number;
  visa: number;
  amex: number;
  zRead: number;
}

export interface ITillDenominationsUpdateObject extends IDenominationsUpdateObject {
  float?: number;
  visa?: number;
  amex?: number;
  zRead?: number;
}

export class TillDenominations extends Denominations {
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

  public with(obj: ITillDenominationsUpdateObject): TillDenominations {
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
}