import {validateCash} from "../../Util/Validation";
import {SafeFloatDenominationsInputs} from "./SafeFloatDenominationsInputs";
import {
  SafeFloatDenominationsAbstract,
  SafeFloatDenominationsApiType,
  SafeFloatDenominationsType,
  SafeFloatDenominationsUpdateType
} from "./SafeFloatDenominationsTypes";

export class SafeFloatDenominations extends SafeFloatDenominationsAbstract<number> implements SafeFloatDenominationsType {
  public static fromApi(obj: SafeFloatDenominationsApiType): SafeFloatDenominations {
    return new SafeFloatDenominations(obj.id, obj.fiftyPounds, obj.twentyPounds, obj.tenPounds, obj.fivePounds, obj.pounds, obj.fiftyPence, obj.twentyPence, obj.tenPence, obj.fivePence, obj.initials,
      new SafeFloatDenominationsInputs(obj.fiftyPounds.toString(), obj.twentyPounds.toString(), obj.tenPounds.toString(), obj.fivePounds.toString(), obj.pounds.toString(), obj.fiftyPence.toString(), obj.twentyPence.toString(), obj.tenPence.toString(), obj.fivePence.toString(), obj.initials)
    );
  }

  public static default() {
    return new SafeFloatDenominations(
      undefined, 0, 0, 0, 0, 0, 0, 0, 0,0, '',
      new SafeFloatDenominationsInputs("","","","","","","","","","",)
    );
  }

  public readonly id?: number;
  public readonly inputs: SafeFloatDenominationsInputs;

  constructor(id: number|undefined, fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, initials: string, inputs: SafeFloatDenominationsInputs) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence, initials);
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: SafeFloatDenominationsUpdateType): SafeFloatDenominations {
    return new SafeFloatDenominations(this.id,
        obj.fiftyPounds !== undefined ? validateCash(obj.fiftyPounds, this.fiftyPounds) : this.fiftyPounds,
      obj.twentyPounds !== undefined ? validateCash(obj.twentyPounds, this.twentyPounds) : this.twentyPounds,
      obj.tenPounds !== undefined ? validateCash(obj.tenPounds, this.tenPounds) : this.tenPounds,
      obj.fivePounds !== undefined ? validateCash(obj.fivePounds, this.fivePounds) : this.fivePounds,
      obj.pounds !== undefined ? validateCash(obj.pounds, this.pounds) : this.pounds,
      obj.fiftyPence !== undefined ? validateCash(obj.fiftyPence, this.fiftyPence) : this.fiftyPence,
      obj.twentyPence !== undefined ? validateCash(obj.twentyPence, this.twentyPence) : this.twentyPence,
      obj.tenPence !== undefined ? validateCash(obj.tenPence, this.tenPence) : this.tenPence,
      obj.fivePence !== undefined ? validateCash(obj.fivePence, this.fivePence) : this.fivePence,
      obj.initials !== undefined ? obj.initials : this.initials,
        this.inputs.with(obj));
  }

  public clone(): SafeFloatDenominations {
    return this.with({});
  }

  public getTotal(): number {
    return this.fiftyPounds
      + this.twentyPounds
      + this.tenPounds
      + this.fivePounds
      + this.pounds
      + this.fiftyPence
      + this.twentyPounds
      + this.tenPence
      + this.fivePence;
  }
}