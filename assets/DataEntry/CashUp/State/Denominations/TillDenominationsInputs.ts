import {Denominations, IDenominationsUpdateObject} from "./Denominations";

export interface ITillDenominationsInputsUpdateObject extends IDenominationsUpdateObject<string> {
  float?: number;
  visa?: number;
  amex?: number;
  zRead?: number;
}

export class TillDenominationsInputs extends Denominations<string> {
  public readonly float: string;
  public readonly visa: string;
  public readonly amex: string;
  public readonly zRead: string;


  constructor(fiftyPounds: string, twentyPounds: string, tenPounds: string, fivePounds: string, pounds: string, fiftyPence: string, twentyPence: string, tenPence: string, fivePence: string, float: string, visa: string, amex: string, zRead: string) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.float = float;
    this.visa = visa;
    this.amex = amex;
    this.zRead = zRead;
  }

  public with(obj: ITillDenominationsInputsUpdateObject): TillDenominationsInputs {
    return Object.assign(
      new TillDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.float, this.visa, this.amex, this.zRead),
      obj
    );
  }

  public clone(): TillDenominationsInputs {
    return this.with({});
  }
}