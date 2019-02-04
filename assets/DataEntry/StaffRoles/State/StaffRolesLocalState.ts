import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {StaffRole} from "../../Rota/State/StaffRole";
import {StaffRoleNotPersisted} from "../../Rota/State/StaffRoleNotPersisted";

export class StaffRolesLocalState extends EditableLocalState<StaffRoleNotPersisted, StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: any) => StaffRole.fromResponse(obj),
      (a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffRoleNotPersisted, StaffRole>): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}