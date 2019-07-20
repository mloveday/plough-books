import * as moment from "moment";
import {validateCash} from "../../Util/Validation";
import {SkimInput} from "./SkimInput";
import {SkimAbstract, SkimApiType, SkimType, SkimUpdateType} from "./SkimTypes";

export class Skim extends SkimAbstract<number> implements SkimType {
  public static fromApi(obj: SkimApiType) {
    return new Skim(obj.amount, obj.initials, obj.witness, SkimInput.fromApi(obj), moment.utc().unix(), obj.id);
  }

  public static default() {
    return new Skim(0, '', '', SkimInput.default(), moment.utc().unix(), undefined);
  }

  public readonly id?: number;
  public readonly timestamp: number;
  public readonly inputs: SkimInput;

  constructor(amount: number, initials: string, witness: string, inputs: SkimInput, timestamp: number, id?: number) {
    super(amount, initials, witness);
    this.inputs = inputs;
    this.timestamp = timestamp;
    this.id = id;
  }

  public with(obj: SkimUpdateType): Skim {
    return new Skim(obj.amount !== undefined ? validateCash(obj.amount, this.amount) : this.amount,
                    obj.initials !== undefined ? obj.initials : this.initials, 
                    obj.witness !== undefined ? obj.witness : this.inputs.witness, 
                    this.inputs.with(obj),
                    this.timestamp,
                    this.id);
  }

  public clone(): Skim {
    return this.with({});
  }
}