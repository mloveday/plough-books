import {ChangeAbstract, ChangeApiType, ChangeUpdateType} from "./ChangeTypes";

export class ChangeInput extends ChangeAbstract<string> {
  public static fromApi(obj: ChangeApiType) {
    return new ChangeInput(obj.amount.toString(), obj.initials, obj.witness);
  }

  public static default() {
    return new ChangeInput('', '', '');
  }

  constructor(amount: string, initials: string, witness: string) {
    super(amount, initials, witness);
  }

  public with(obj: ChangeUpdateType): ChangeInput {
    return new ChangeInput(obj.amount !== undefined ? obj.amount : this.amount,
                           obj.initials !== undefined ? obj.initials : this.initials,
                           obj.witness !== undefined ? obj.witness : this.witness);
  }

  public clone(): ChangeInput {
    return this.with({});
  }
}