import {StaffRole} from "../../Rota/State/StaffRole";

export class StaffRolesLocalState {
  public static default() {
    return new StaffRolesLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly editingRoleId: number = StaffRolesLocalState.NOT_EDITING_ID;
  public readonly isCreatingRole: boolean = false;
  public readonly newRole: StaffRole;
  public readonly roles: StaffRole[] = [];

  public withNewRole(role: StaffRole) {
    return this.with({
      isCreatingRole: true,
      newRole: role,
      roles: this.roles.map(r => r.with({})),
    })
  }

  public withRoles(obj: any[], editingRoleId: number = StaffRolesLocalState.NOT_EDITING_ID) {

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
    return this.with(
      {
        editingRoleId,
        roles: Array.from(staffRoles.values()).sort((a: StaffRole, b: StaffRole) => a.role > b.role ? 1 : -1)
      }
    );
  }

  public isEditing() {
    return this.editingRoleId !== StaffRolesLocalState.NOT_EDITING_ID;
  }

  public with(obj: any) {
    return Object.assign(
      new StaffRolesLocalState(),
      this,
      obj
    );
  }
}