import {validateCash} from "../../../../Util/Validation";
import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";
import {SafeFloatDenominationsInputs} from "./SafeFloatDenominationsInputs";

export interface ISafeFloatDenominationsApiObject<T> extends IDenominationsApiObject<T> {
  id: number;
  initials: string;
}

export interface ISafeFloatDenominationsUpdateObject<T> extends IDenominationsUpdateObject<T> {
  initials?: string;
}

export class SafeFloatDenominations extends Denominations<number, string> {
  public static parseApiResponse(obj: ISafeFloatDenominationsApiObject<number>): SafeFloatDenominations {
    return new SafeFloatDenominations(obj.id, obj.fiftyPounds, obj.twentyPounds, obj.tenPounds, obj.fivePounds, obj.pounds, obj.fiftyPence, obj.twentyPence, obj.tenPence, obj.fivePence, obj.initials,
      new SafeFloatDenominationsInputs(obj.fiftyPounds.toString(), obj.twentyPounds.toString(), obj.tenPounds.toString(), obj.fivePounds.toString(), obj.pounds.toString(), obj.fiftyPence.toString(), obj.twentyPence.toString(), obj.tenPence.toString(), obj.fivePence.toString(), obj.initials)
    );
  }

  public static default() {
    return new SafeFloatDenominations(
      undefined, 0, 0, 0, 0, 0, 0, 0, 0,0, '',
      new SafeFloatDenominationsInputs("0","0","0","0","0","0","0","0","0","",)
    );
  }

  public readonly id?: number;
  public readonly initials: string;
  public readonly inputs: SafeFloatDenominationsInputs;

  constructor(id: number|undefined, fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, initials: string, inputs: SafeFloatDenominationsInputs) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.initials = initials;
    this.inputs = inputs;
  }

  public with(obj: ISafeFloatDenominationsUpdateObject<string>): SafeFloatDenominations {
    return new SafeFloatDenominations(this.id,
        obj.fiftyPounds ? validateCash(obj.fiftyPounds, this.fiftyPounds) : this.fiftyPounds, obj.twentyPounds ? validateCash(obj.twentyPounds, this.twentyPounds) : this.twentyPounds, obj.tenPounds ? validateCash(obj.tenPounds, this.tenPounds) : this.tenPounds, obj.fivePounds ? validateCash(obj.fivePounds, this.fivePounds) : this.fivePounds, obj.pounds ? validateCash(obj.pounds, this.pounds) : this.pounds, obj.fiftyPence ? validateCash(obj.fiftyPence, this.fiftyPence) : this.fiftyPence, obj.twentyPence ? validateCash(obj.twentyPence, this.twentyPence) : this.twentyPence, obj.tenPence ? validateCash(obj.tenPence, this.tenPence) : this.tenPence, obj.fivePence ? validateCash(obj.fivePence, this.fivePence) : this.fivePence, obj.initials ? obj.initials : this.initials,
        this.inputs.with(obj));
  }

  public clone(): SafeFloatDenominations {
    return this.with({});
  }
}