import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {Constants} from "../../Rota/State/Constants";

export class ConstantsLocalState extends EditableLocalState<Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super(
      obj => Constants.default().with(obj),
      (a: Constants, b: Constants) => a.date < b.date ? 1 : -1
    );
  }
  
  public with(obj: IApiEditableLocalState<Constants>) {
    return Object.assign(
      new ConstantsLocalState(),
      this,
      obj
    );
  }
}