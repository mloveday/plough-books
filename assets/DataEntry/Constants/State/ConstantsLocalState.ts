import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {Constants} from "./Constants";
import {ConstantsNotPersisted} from "./ConstantsNotPersisted";

export class ConstantsLocalState extends EditableLocalState<ConstantsNotPersisted, Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super(
      obj => Constants.fromResponse(obj),
      (a: Constants, b: Constants) => a.date < b.date ? 1 : -1
    );
  }
  
  public with(obj: IApiEditableLocalState<ConstantsNotPersisted, Constants>) {
    return Object.assign(
      new ConstantsLocalState(),
      this,
      obj
    );
  }
}