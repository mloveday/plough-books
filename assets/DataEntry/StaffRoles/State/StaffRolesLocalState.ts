import {EditableDualLocalState, IApiEditableDualLocalState} from "../../../State/EditableDualLocalState";
import {StaffRole} from "../../Rota/State/StaffRole";
import {StaffRoleNotPersisted} from "../../Rota/State/StaffRoleNotPersisted";

export class StaffRolesLocalState extends EditableDualLocalState<StaffRoleNotPersisted, StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: any) => StaffRole.fromResponse(obj),
      (a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableDualLocalState<StaffRoleNotPersisted, StaffRole>): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}