import {DenominationsInputs, IDenominationsInputsUpdateObject} from "./DenominationsInputs";

export interface ISafeFloatDenominationsInputsUpdateObject extends IDenominationsInputsUpdateObject {
  initials?: string;
}

export class SafeFloatDenominationsInputs extends DenominationsInputs {
  public static default() {
    return new SafeFloatDenominationsInputs(
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "0",
      "",
    );
  }

  public readonly initials: string;


  constructor(fiftyPounds: string, twentyPounds: string, tenPounds: string, fivePounds: string, pounds: string, fiftyPence: string, twentyPence: string, tenPence: string, fivePence: string, initials: string) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.initials = initials;
  }

  public with(obj: ISafeFloatDenominationsInputsUpdateObject): SafeFloatDenominationsInputs {
    return Object.assign(
      new SafeFloatDenominationsInputs(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.initials),
      obj
    );
  }
}