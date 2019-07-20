import * as moment from "moment";
import {validateCash} from "../../Util/Validation";
import {ChangeInput} from "./ChangeInput";
import {ChangeAbstract, ChangeApiType, ChangeType, ChangeUpdateType} from "./ChangeTypes";

export class Change extends ChangeAbstract<number> implements ChangeType {
  public static fromApi(obj: ChangeApiType) {
    return new Change(obj.amount, obj.initials, obj.witness, ChangeInput.fromApi(obj), moment.utc().unix(), obj.id);
  }

  public static default() {
    return new Change(0, '', '', ChangeInput.default(), moment.utc().unix(), undefined);
  }

  public readonly id?: number;
  public readonly timestamp: number;
  public readonly inputs: ChangeInput;

  constructor(amount: number, initials: string, witness: string, inputs: ChangeInput, timestamp: number, id?: number) {
    super(amount, initials, witness);
    this.inputs = inputs;
    this.timestamp = timestamp;
    this.id = id;
  }

  public with(obj: ChangeUpdateType): Change {
    return new Change(obj.amount !== undefined ? validateCash(obj.amount, this.amount) : this.amount,
                      obj.initials !== undefined ? obj.initials : this.initials,
                      obj.witness !== undefined ? obj.witness : this.inputs.witness,
                      this.inputs.with(obj),
                      this.timestamp,
                      this.id);
  }

  public clone(): Change {
    return this.with({});
  }
}