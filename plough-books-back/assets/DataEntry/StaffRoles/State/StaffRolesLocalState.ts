import {EditableLocalState} from "../../../State/EditableLocalState";
import {StaffRole} from "../../Rota/State/StaffRole";

export class StaffRolesLocalState extends EditableLocalState<StaffRole> {
  public static default() {
    return new StaffRolesLocalState();
  }

  public constructor() {
    super(
      (obj: any) => StaffRole.default().with(obj),
      (a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: any): StaffRolesLocalState {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}