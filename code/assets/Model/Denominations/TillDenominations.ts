import {validateCash} from "../../Util/Validation";
import {TillDenominationsInputs} from "./TillDenominationsInputs";
import {
  TillDenominationsAbstract,
  TillDenominationsApiType,
  TillDenominationsType,
  TillDenominationsUpdateType
} from "./TillDenominationsTypes";

export class TillDenominations extends TillDenominationsAbstract<number> implements TillDenominationsType {
  public static fromApi(obj: TillDenominationsApiType): TillDenominations {
    return new TillDenominations(obj.fiftyPounds, obj.twentyPounds, obj.tenPounds, obj.fivePounds, obj.pounds, obj.fiftyPence, obj.twentyPence, obj.tenPence, obj.fivePence, obj.float_amnt, obj.visa, obj.amex, obj.zRead, TillDenominationsInputs.fromApi(obj), obj.id);
  }
  
  public static default() {
    return new TillDenominations(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, new TillDenominationsInputs("", "", "", "", "", "", "", "", "", "", "", "", "",));
  }

  public readonly id?: number;
  public readonly inputs: TillDenominationsInputs;

  constructor(fiftyPounds: number, twentyPounds: number, tenPounds: number, fivePounds: number, pounds: number, fiftyPence: number, twentyPence: number, tenPence: number, fivePence: number, float: number, visa: number, amex: number, zRead: number, inputs: TillDenominationsInputs, id?: number) {
    super(fiftyPounds, twentyPounds, tenPounds, fivePounds, pounds, fiftyPence, twentyPence, tenPence, fivePence, float, visa, amex, zRead);
    this.id = id;
    this.inputs = inputs;
  }

  public with(obj: TillDenominationsUpdateType): TillDenominations {
    return new TillDenominations(
      obj.fiftyPounds !== undefined ? validateCash(obj.fiftyPounds, this.fiftyPounds) : this.fiftyPounds, 
      obj.twentyPounds !== undefined ? validateCash(obj.twentyPounds, this.twentyPounds) : this.twentyPounds, 
      obj.tenPounds !== undefined ? validateCash(obj.tenPounds, this.tenPounds) : this.tenPounds, 
      obj.fivePounds !== undefined ? validateCash(obj.fivePounds, this.fivePounds) : this.fivePounds, 
      obj.pounds !== undefined ? validateCash(obj.pounds, this.pounds) : this.pounds, 
      obj.fiftyPence !== undefined ? validateCash(obj.fiftyPence, this.fiftyPence) : this.fiftyPence, 
      obj.twentyPence !== undefined ? validateCash(obj.twentyPence, this.twentyPence) : this.twentyPence, 
      obj.tenPence !== undefined ? validateCash(obj.tenPence, this.tenPence) : this.tenPence, 
      obj.fivePence !== undefined ? validateCash(obj.fivePence, this.fivePence) : this.fivePence, 
      obj.float_amnt !== undefined ? validateCash(obj.float_amnt, this.float_amnt) : this.float_amnt, 
      obj.visa !== undefined ? validateCash(obj.visa, this.visa) : this.visa, 
      obj.amex !== undefined ? validateCash(obj.amex, this.amex) : this.amex, 
      obj.zRead !== undefined ? validateCash(obj.zRead, this.zRead) : this.zRead,
      this.inputs.with(obj),
      this.id
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