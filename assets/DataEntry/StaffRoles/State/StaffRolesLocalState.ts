import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {IStaffRoleApiObject, StaffRole} from "./StaffRole";
import {StaffRoleNotPersisted} from "./StaffRoleNotPersisted";

export class StaffRolesLocalState extends EditableLocalState<StaffRoleNotPersisted, StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: IStaffRoleApiObject) => StaffRole.fromResponse(obj),
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