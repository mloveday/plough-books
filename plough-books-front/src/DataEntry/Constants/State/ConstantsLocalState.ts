import {Constants} from "../../Rota/State/Constants";

export class ConstantsLocalState {
  public static default() {
    return new ConstantsLocalState();
  }

  public readonly constants: Constants[] = [];
  
  public with(obj: any) {
    return Object.assign(
      new ConstantsLocalState(),
      {constants: obj.map((member: any) => Constants.default().with(member))
        .sort((a: Constants, b: Constants) => a.date < b.date ? 1 : -1)}
    );
  }
}