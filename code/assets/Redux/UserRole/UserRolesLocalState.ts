import {UserRole} from "../../Model/UserRole/UserRole";
import {UserRoleApiType} from "../../Model/UserRole/UserRoleTypes";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class UserRolesLocalState extends EditableLocalState<UserRole> {
  public static default() {
    return new UserRolesLocalState();
  }
  protected readonly fromObjFn: (obj: UserRoleApiType) => UserRole;

  public constructor() {
    super(
      (obj: UserRole) => obj.clone(),
      (a: UserRole, b: UserRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<UserRole>): UserRolesLocalState {
    return Object.assign(
      new UserRolesLocalState(),
      this,
      obj,
    );
  }

  public withEntities(obj: UserRole[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): UserRolesLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: UserRole, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): UserRolesLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: UserRole): UserRolesLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}