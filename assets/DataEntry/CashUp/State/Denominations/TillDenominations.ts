import {validateCash} from "../../../../Util/Validation";
import {Denominations, IDenominationsApiObject, IDenominationsUpdateObject} from "./Denominations";
import {TillDenominationsInputs} from "./TillDenominationsInputs";

export interface ITillDenominationsApiObject<T> extends IDenominationsApiObject<T> {
  float: T;
  visa: T;
  amex: T;
  zRead: T;
}

export interface ITillDenominationsUpdateObject<T> extends IDenominationsUpdateObject<T> {
  float?: T;
  visa?: T;
  amex?: T;
  zRead?: T;
}

export class TillDenominations extends Denominations<number, string> {
  public static parseApiResponse(obj: ITillDenominationsApiObject<number>): TillDenominations {
    return new TillDenominations(obj.visa, obj.amex, obj.fiftyPounds, obj.twentyPounds, obj.tenPounds, obj.fivePounds, obj.pounds, obj.fiftyPence, obj.twentyPence, obj.tenPence, obj.fivePence, obj.float, obj.zRead,
      new TillDenominationsInputs(obj.visa.toString(), obj.amex.toString(), obj.fiftyPounds.toString(), obj.twentyPounds.toString(), obj.tenPounds.toString(), obj.fivePounds.toString(), obj.pounds.toString(), obj.fiftyPence.toString(), obj.twentyPence.toString(), obj.tenPence.toString(), obj.fivePence.toString(), obj.float.toString(), obj.zRead.toString())
    );
  }
  
  public static default() {
    return new TillDenominations(0,0,0,0,0,0,0,0,0,0,0,0,0,
      new TillDenominationsInputs("0","0","0","0","0","0","0","0","0","0","0","0","0",)
    );
  }

  public readonly float: number;
  public readonly visa: number;
  public readonly amex: number;
  public readonly zRead: number;
  public readonly inputs: TillDenominationsInputs;

  constructor(visa: number, amex: number, fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, float: number, zRead: number, inputs: TillDenominationsInputs) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence);
    this.float = float;
    this.visa = visa;
    this.amex = amex;
    this.zRead = zRead;
    this.inputs = inputs;
  }

  public with(obj: ITillDenominationsUpdateObject<string>): TillDenominations {
    return new TillDenominations(
      obj.visa ? validateCash(obj.visa, this.visa) : this.visa,
      obj.amex ? validateCash(obj.amex, this.amex) : this.amex,
      obj.fiftyPounds ? validateCash(obj.fiftyPounds, this.fiftyPounds) : this.fiftyPounds,
      obj.twentyPounds ? validateCash(obj.twentyPounds, this.twentyPounds) : this.twentyPounds,
      obj.tenPounds ? validateCash(obj.tenPounds, this.tenPounds) : this.tenPounds,
      obj.fivePounds ? validateCash(obj.fivePounds, this.fivePounds) : this.fivePounds,
      obj.pounds ? validateCash(obj.pounds, this.pounds) : this.pounds,
      obj.fiftyPence ? validateCash(obj.fiftyPence, this.fiftyPence) : this.fiftyPence,
      obj.twentyPence ? validateCash(obj.twentyPence, this.twentyPence) : this.twentyPence,
      obj.tenPence ? validateCash(obj.tenPence, this.tenPence) : this.tenPence,
      obj.fivePence ? validateCash(obj.fivePence, this.fivePence) : this.fivePence,
      obj.float ? validateCash(obj.float, this.float) : this.float,
      obj.zRead ? validateCash(obj.zRead, this.zRead) : this.zRead,
      this.inputs.with(obj)
    );
  }

  public clone(): TillDenominations {
    return this.with({});
  }

  public totalTaken(): number {
    return this.visa + this.amex + this.totalCashTaken();
  }

  private totalCashTaken(): number {
    return this.fiftyPounds + this.twentyPounds + this.tenPounds + this.fivePounds + this.pounds + this.fiftyPence + this.twentyPence + this.tenPence + this.fivePence
  }
}