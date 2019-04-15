import {Formatting} from "../../Util/Formatting";
import {
  TillDenominationsAbstract, TillDenominationsApiType,
  TillDenominationsInputType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominationsInputs extends TillDenominationsAbstract<string> implements TillDenominationsInputType {
  public static fromApi(obj: TillDenominationsApiType) {
    return new TillDenominationsInputs(
      Formatting.formatCashForInput(obj.fiftyPounds),
      Formatting.formatCashForInput(obj.twentyPounds),
      Formatting.formatCashForInput(obj.tenPounds),
      Formatting.formatCashForInput(obj.fivePounds),
      Formatting.formatCashForInput(obj.pounds),
      Formatting.formatCashForInput(obj.fiftyPence),
      Formatting.formatCashForInput(obj.twentyPence),
      Formatting.formatCashForInput(obj.tenPence),
      Formatting.formatCashForInput(obj.fivePence),
      Formatting.formatCashForInput(obj.float_amnt),
      Formatting.formatCashForInput(obj.visa),
      Formatting.formatCashForInput(obj.amex),
      Formatting.formatCashForInput(obj.zRead)
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