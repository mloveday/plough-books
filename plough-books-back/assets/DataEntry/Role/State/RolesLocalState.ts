import {Role} from "../../../Auth/Model/Role";

export class RolesLocalState {
  public static default() {
    return new RolesLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly editingRoleId: number = RolesLocalState.NOT_EDITING_ID;
  public readonly isCreatingRole: boolean = false;
  public readonly roles: Role[] = [];
  public readonly newRole: Role;

  public withNewRole(role: Role) {
    return this.with({
      isCreatingRole: true,
      roles: this.roles.map(m => m.with({})),
      newRole: role,
    });
  }

  public withRoles(obj: any[], editingRoleId: number = RolesLocalState.NOT_EDITING_ID) {
    const newRoles = new Map<number, Role>();
    obj.forEach(v => {
      newRoles.set(v.id, Role.default().with(v))
    });
    const roles = new Map<number, Role>();
    this.roles.forEach(v => {
      const role = newRoles.get(v.roleId);
      roles.set(v.roleId, role ? role : v.with({}));
    });
    newRoles.forEach((v, k) => roles.set(k, v));
    return Object.assign(
      new RolesLocalState(),
      this,
      {
        editingRoleId,
        roles: Array.from(roles.values()).sort((a: Role, b: Role) => a.role > b.role ? 1 : -1)
      }
    );
  }

  public with(obj: any) {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }

  public isEditing() {
    return this.editingRoleId !== RolesLocalState.NOT_EDITING_ID;
  }
}