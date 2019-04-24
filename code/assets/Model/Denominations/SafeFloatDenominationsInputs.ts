import {
  SafeFloatDenominationsAbstract,
  SafeFloatDenominationsInputType,
  SafeFloatDenominationsUpdateType
} from "./SafeFloatDenominationsTypes";

export class SafeFloatDenominationsInputs extends SafeFloatDenominationsAbstract<string> implements SafeFloatDenominationsInputType {

  public with(obj: SafeFloatDenominationsUpdateType): SafeFloatDenominationsInputs {
    return new SafeFloatDenominationsInputs(
      obj.fiftyPounds !== undefined ? obj.fiftyPounds : this.fiftyPounds,
      obj.twentyPounds !== undefined ? obj.twentyPounds : this.twentyPounds,
      obj.tenPounds !== undefined ? obj.tenPounds : this.tenPounds, 
      obj.fivePounds !== undefined ? obj.fivePounds : this.fivePounds,
      obj.pounds !== undefined ? obj.pounds : this.pounds, 
      obj.fiftyPence !== undefined ? obj.fiftyPence : this.fiftyPence, 
      obj.twentyPence !== undefined ? obj.twentyPence : this.twentyPence, 
      obj.tenPence !== undefined ? obj.tenPence : this.tenPence, 
      obj.fivePence !== undefined ? obj.fivePence : this.fivePence,
      obj.initials !== undefined ? obj.initials : this.initials
    );
  }

  public clone(): SafeFloatDenominationsInputs {
    return this.with({});
  }
}