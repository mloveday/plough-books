import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class StaffRolesLocalState extends EditableLocalState<StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super((a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1);
  }

  public with(obj: IApiEditableLocalState<StaffRole>): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }

  public withEntities(obj: StaffRole[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): StaffRolesLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: StaffRole, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): StaffRolesLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: StaffRole): StaffRolesLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}