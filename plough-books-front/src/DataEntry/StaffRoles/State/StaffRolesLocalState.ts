import {StaffRole} from "../../Rota/State/StaffRole";

export class StaffRolesLocalState {
  public static default() {
    return new StaffRolesLocalState();
  }

  public readonly roles: StaffRole[] = [];

  public with(obj: any) {
    return Object.assign(
      new StaffRolesLocalState(),
      {roles: obj.map((role: any) => StaffRole.default().with(role))
        .sort((a: StaffRole, b: StaffRole) => a.orderInRota > b.orderInRota ? 1 : -1)}
    );
  }
}