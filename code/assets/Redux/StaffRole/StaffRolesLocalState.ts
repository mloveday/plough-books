import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {StaffRoleApiType} from "../../Model/StaffRole/StaffRoleTypes";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class StaffRolesLocalState extends EditableLocalState<StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: StaffRoleApiType) => StaffRole.fromResponse(obj),
      (a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<StaffRole>): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}