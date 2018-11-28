import {StaffRole} from "../../Rota/State/StaffRole";

export class StaffRolesLocalState {
  public static default() {
    return new StaffRolesLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly roles: StaffRole[] = [];
  public readonly editingRoleId: number = StaffRolesLocalState.NOT_EDITING_ID;

  public with(obj: any[], editingRoleId: number = StaffRolesLocalState.NOT_EDITING_ID) {

    const newStaffRoles = new Map<number, StaffRole>();
    obj.forEach(v => {
      newStaffRoles.set(v.id, StaffRole.default().with(v))
    });
    const staffRoles = new Map<number, StaffRole>();
    this.roles.forEach(v => {
      const staffRole = newStaffRoles.get(v.id);
      staffRoles.set(v.id, staffRole ? staffRole : v.with({}));
    });
    newStaffRoles.forEach((v,k) => staffRoles.set(k, v));
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      {
        editingRoleId,
        roles: Array.from(staffRoles.values()).sort((a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1)
      }
    );
  }

  public isEditing() {
    return this.editingRoleId !== StaffRolesLocalState.NOT_EDITING_ID;
  }
}