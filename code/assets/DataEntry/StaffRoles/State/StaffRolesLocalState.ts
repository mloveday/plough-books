import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";
import {StaffRole} from "./StaffRole";
import {StaffRoleApiType} from "./StaffRoleTypes";

export class StaffRolesLocalState extends EditableLocalState<StaffRole, StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: StaffRoleApiType) => StaffRole.fromResponse(obj),
      (a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffRole, StaffRole>): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}