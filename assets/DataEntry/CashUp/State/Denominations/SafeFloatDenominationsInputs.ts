import {
  SafeFloatDenominationsAbstract,
  SafeFloatDenominationsInputType,
  SafeFloatDenominationsUpdateType
} from "./SafeFloatDenominationsTypes";

export class SafeFloatDenominationsInputs extends SafeFloatDenominationsAbstract<string> implements SafeFloatDenominationsInputType {

  public with(obj: SafeFloatDenominationsUpdateType): SafeFloatDenominationsInputs {
    return Object.assign(
      new SafeFloatDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.initials),
      obj
    );
  }

  public clone(): SafeFloatDenominationsInputs {
    return this.with({});
  }
}