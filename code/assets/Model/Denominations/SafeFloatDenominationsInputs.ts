import {
  SafeFloatDenominationsAbstract,
  SafeFloatDenominationsInputType,
  SafeFloatDenominationsUpdateType
} from "./SafeFloatDenominationsTypes";

export class SafeFloatDenominationsInputs extends SafeFloatDenominationsAbstract<string> implements SafeFloatDenominationsInputType {

  public with(obj: SafeFloatDenominationsUpdateType): SafeFloatDenominationsInputs {
    return new SafeFloatDenominationsInputs(obj.fiftyPounds ? obj.fiftyPounds : this.fiftyPounds, obj.twentyPounds ? obj.twentyPounds : this.twentyPounds, obj.tenPounds ? obj.tenPounds : this.tenPounds, obj.fivePounds ? obj.fivePounds : this.fivePounds, obj.pounds ? obj.pounds : this.pounds, obj.fiftyPence ? obj.fiftyPence : this.fiftyPence, obj.twentyPence ? obj.twentyPence : this.twentyPence, obj.tenPence ? obj.tenPence : this.tenPence, obj.fivePence ? obj.fivePence : this.fivePence, obj.initials ? obj.initials : this.initials);
  }

  public clone(): SafeFloatDenominationsInputs {
    return this.with({});
  }
}