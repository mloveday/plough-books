import {Constants} from "../../Model/Constants/Constants";
import {momentFromDate} from "../../Util/DateUtils";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class ConstantsLocalState extends EditableLocalState<Constants> {
  public static default() {
    return new ConstantsLocalState();
  }

  public constructor() {
    super((a: Constants, b: Constants) => momentFromDate(a.date) < momentFromDate(b.date) ? 1 : -1);
  }
  
  public with(obj: IApiEditableLocalState<Constants>): ConstantsLocalState {
    return Object.assign(
      new ConstantsLocalState(),
      this,
      obj
    );
  }

  public withEntities(obj: Constants[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): ConstantsLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: Constants, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): ConstantsLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: Constants): ConstantsLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}