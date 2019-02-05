import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";

export interface ISafeFloatDenominationsApiObject extends IDenominationsApiObject {
  initials: string;
}

export interface ISafeFloatDenominationsUpdateObject extends IDenominationsUpdateObject {
  initials?: string;
}

export class SafeFloatDenominations extends Denominations {
  public static default() {
    return new SafeFloatDenominations(
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      '',
    );
  }

  public readonly initials: string;

  constructor(fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, initials: string) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.initials = initials;
  }

  public with(obj: ISafeFloatDenominationsUpdateObject): SafeFloatDenominations {
    return Object.assign(
      new SafeFloatDenominations(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.initials),
      obj
    );
  }

  public clone(): SafeFloatDenominations {
    return this.with({});
  }
}