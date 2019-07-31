import {Holiday} from "../../Model/Holiday/Holiday";
import {momentFromDate} from "../../Util/DateUtils";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class HolidayLocalState extends EditableLocalState<Holiday> {
  public static default() {
    return new HolidayLocalState();
  }

  public constructor() {
    super((a: Holiday, b: Holiday) => momentFromDate(a.startDate) < momentFromDate(b.startDate) ? 1 : -1);
  }
  
  public with(obj: IApiEditableLocalState<Holiday>): HolidayLocalState {
    return Object.assign(
      new HolidayLocalState(),
      this,
      obj
    );
  }

  public withEntities(obj: Holiday[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): HolidayLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: Holiday, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): HolidayLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: Holiday): HolidayLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}