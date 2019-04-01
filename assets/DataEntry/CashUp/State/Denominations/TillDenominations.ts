import {validateCash} from "../../../../Util/Validation";
import {TillDenominationsInputs} from "./TillDenominationsInputs";
import {
  TillDenominationsAbstract,
  TillDenominationsApiType,
  TillDenominationsType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominations extends TillDenominationsAbstract<number> implements TillDenominationsType {
  public static parseApiResponse(obj: TillDenominationsApiType): TillDenominations {
    return new TillDenominations(obj.id, obj.visa, obj.amex, obj.fiftyPounds, obj.twentyPounds, obj.tenPounds, obj.fivePounds, obj.pounds, obj.fiftyPence, obj.twentyPence, obj.tenPence, obj.fivePence, obj.float, obj.zRead, new TillDenominationsInputs(obj.visa.toString(), obj.amex.toString(), obj.fiftyPounds.toString(), obj.twentyPounds.toString(), obj.tenPounds.toString(), obj.fivePounds.toString(), obj.pounds.toString(), obj.fiftyPence.toString(), obj.twentyPence.toString(), obj.tenPence.toString(), obj.fivePence.toString(), obj.float.toString(), obj.zRead.toString()));
  }
  
  public static default() {
    return new TillDenominations(undefined, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new TillDenominationsInputs("", "", "", "", "", "", "", "", "", "", "", "", "",));
  }

  public readonly id?: number;
  public readonly inputs: TillDenominationsInputs;

  constructor(id: number|undefined, visa: number, amex: number, fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, float: number, zRead: number, inputs: TillDenominationsInputs) {
    super(visa, amex, fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence, float, zRead);
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: TillDenominationsUpdateType): TillDenominations {
    return new TillDenominations(this.id, obj.visa ? validateCash(obj.visa, this.visa) : this.visa, obj.amex ? validateCash(obj.amex, this.amex) : this.amex, obj.fiftyPounds ? validateCash(obj.fiftyPounds, this.fiftyPounds) : this.fiftyPounds, obj.twentyPounds ? validateCash(obj.twentyPounds, this.twentyPounds) : this.twentyPounds, obj.tenPounds ? validateCash(obj.tenPounds, this.tenPounds) : this.tenPounds, obj.fivePounds ? validateCash(obj.fivePounds, this.fivePounds) : this.fivePounds, obj.pounds ? validateCash(obj.pounds, this.pounds) : this.pounds, obj.fiftyPence ? validateCash(obj.fiftyPence, this.fiftyPence) : this.fiftyPence, obj.twentyPence ? validateCash(obj.twentyPence, this.twentyPence) : this.twentyPence, obj.tenPence ? validateCash(obj.tenPence, this.tenPence) : this.tenPence, obj.fivePence ? validateCash(obj.fivePence, this.fivePence) : this.fivePence, obj.float ? validateCash(obj.float, this.float) : this.float, obj.zRead ? validateCash(obj.zRead, this.zRead) : this.zRead, this.inputs.with(obj));
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