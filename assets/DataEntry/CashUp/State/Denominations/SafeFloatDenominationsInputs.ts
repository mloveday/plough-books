import {Denominations} from "./Denominations";
import {ISafeFloatDenominationsUpdateObject} from "./SafeFloatDenominations";

export class SafeFloatDenominationsInputs extends Denominations<string, string> {
  public readonly initials: string;

  constructor(fiftyPounds: string, twentyPounds: string, tenPounds: string, fivePounds: string, pounds: string, fiftyPence: string, twentyPence: string, tenPence: string, fivePence: string, initials: string) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.initials = initials;
  }

  public with(obj: ISafeFloatDenominationsUpdateObject<string>): SafeFloatDenominationsInputs {
    return Object.assign(
      new SafeFloatDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.initials),
      obj
    );
  }

  public clone(): SafeFloatDenominationsInputs {
    return this.with({});
  }
}