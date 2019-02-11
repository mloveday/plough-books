import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";

export interface ISafeFloatDenominationsApiObject<T> extends IDenominationsApiObject<T> {
  initials: string;
}

export interface ISafeFloatDenominationsUpdateObject<T> extends IDenominationsUpdateObject<T> {
  initials?: string;
}

export class SafeFloatDenominations extends Denominations<number> implements ISafeFloatDenominationsApiObject<number> {
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

  public with(obj: ISafeFloatDenominationsUpdateObject<number>): SafeFloatDenominations {
    return Object.assign(
      new SafeFloatDenominations(this.fiftyPounds, this.twentyPounds, this.tenPounds, this.fivePounds, this.pounds, this.fiftyPence, this.twentyPence, this.tenPence, this.fivePence, this.initials),
      obj
    );
  }

  public clone(): SafeFloatDenominations {
    return this.with({});
  }
}