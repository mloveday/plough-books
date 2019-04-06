import * as moment from "moment";
import {EditableLocalState, IApiEditableLocalState} from "../../State/EditableLocalState";
import {Constants} from "../../Model/Constants/Constants";

export class ConstantsLocalState extends EditableLocalState<Constants, Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super(
      obj => Constants.fromResponse(obj),
      (a: Constants, b: Constants) => moment.utc(a.date) < moment.utc(b.date) ? 1 : -1
    );
  }
  
  public with(obj: IApiEditableLocalState<Constants, Constants>) {
    return Object.assign(
      new ConstantsLocalState(),
      this,
      obj
    );
  }
}