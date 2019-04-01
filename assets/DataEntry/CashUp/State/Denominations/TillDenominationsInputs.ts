import {
  TillDenominationsAbstract,
  TillDenominationsInputType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominationsInputs extends TillDenominationsAbstract<string> implements TillDenominationsInputType {

  constructor(fiftyPounds: string, twentyPounds: string, tenPounds: string, fivePounds: string, pounds: string, fiftyPence: string, twentyPence: string, tenPence: string, fivePence: string, float: string, visa: string, amex: string, zRead: string) {
    super(visa, amex, fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence, float, zRead);
  }

  public with(obj: TillDenominationsUpdateType): TillDenominationsInputs {
    return Object.assign(
      new TillDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.float, this.visa, this.amex, this.zRead),
      obj
    );
  }

  public clone(): TillDenominationsInputs {
    return this.with({});
  }
}