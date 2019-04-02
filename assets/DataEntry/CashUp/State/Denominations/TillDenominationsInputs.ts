import {
  TillDenominationsAbstract,
  TillDenominationsInputType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominationsInputs extends TillDenominationsAbstract<string> implements TillDenominationsInputType {

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