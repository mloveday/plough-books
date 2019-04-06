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
      (obj: UserRoleApiType) => UserRole.fromResponse(obj),
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
}