import {SkimAbstract, SkimApiType, SkimUpdateType} from "./SkimTypes";

export class SkimInput extends SkimAbstract<string> {
  public static fromApi(obj: SkimApiType) {
    return new SkimInput(obj.amount.toString(), obj.initials, obj.witness);
  }

  public static default() {
    return new SkimInput('', '', '');
  }

  constructor(amount: string, initials: string, witness: string) {
    super(amount, initials, witness);
  }

  public with(obj: SkimUpdateType): SkimInput {
    return new SkimInput(obj.amount !== undefined ? obj.amount : this.amount,
                         obj.initials !== undefined ? obj.initials : this.initials,
                         obj.witness !== undefined ? obj.witness : this.witness);
  }

  public clone(): SkimInput {
    return this.with({});
  }
}