import {EditableDualLocalState, IApiEditableDualLocalState} from "../../../State/EditableDualLocalState";
import {Constants} from "../../Rota/State/Constants";
import {ConstantsNotPersisted} from "../../Rota/State/ConstantsNotPersisted";

export class ConstantsLocalState extends EditableDualLocalState<ConstantsNotPersisted, Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super(
      obj => Constants.default().with(obj),
      (a: Constants, b: Constants) => a.date < b.date ? 1 : -1
    );
  }
  
  public with(obj: IApiEditableDualLocalState<ConstantsNotPersisted, Constants>) {
    return Object.assign(
      new ConstantsLocalState(),
      this,
      obj
    );
  }
}