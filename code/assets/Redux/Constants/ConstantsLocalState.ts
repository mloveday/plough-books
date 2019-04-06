import * as moment from "moment";
import {Constants} from "../../Model/Constants/Constants";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class ConstantsLocalState extends EditableLocalState<Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super(
      obj => Constants.fromResponse(obj),
      (a: Constants, b: Constants) => moment.utc(a.date) < moment.utc(b.date) ? 1 : -1
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