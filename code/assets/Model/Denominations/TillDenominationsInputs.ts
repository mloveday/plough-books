import {Formatting} from "../../Util/Formatting";
import {
  TillDenominationsAbstract, TillDenominationsApiType,
  TillDenominationsInputType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominationsInputs extends TillDenominationsAbstract<string> implements TillDenominationsInputType {
  public static fromApi(obj: TillDenominationsApiType) {
    return new TillDenominationsInputs(
      Formatting.formatCash(obj.fiftyPounds, false),
      Formatting.formatCash(obj.twentyPounds, false),
      Formatting.formatCash(obj.tenPounds, false),
      Formatting.formatCash(obj.fivePounds, false),
      Formatting.formatCash(obj.pounds, false),
      Formatting.formatCash(obj.fiftyPence, false),
      Formatting.formatCash(obj.twentyPence, false),
      Formatting.formatCash(obj.tenPence, false),
      Formatting.formatCash(obj.fivePence, false),
      Formatting.formatCash(obj.float_amnt, false),
      Formatting.formatCash(obj.visa, false),
      Formatting.formatCash(obj.amex, false),
      Formatting.formatCash(obj.zRead, false)
    );
  }

  public with(obj: TillDenominationsUpdateType): TillDenominationsInputs {
    return Object.assign(
      new TillDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.float_amnt, this.visa, this.amex, this.zRead),
      obj
    );
  }

  public clone(): TillDenominationsInputs {
    return this.with({});
  }
}