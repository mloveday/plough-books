import {UserRole} from "../../../Model/UserRole/UserRole";
import {UserRoleApiType} from "../../../Model/UserRole/UserRoleTypes";
import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";

export class RolesLocalState extends EditableLocalState<UserRole, UserRole> {
  public static default() {
    return new RolesLocalState();
  }
  protected readonly fromObjFn: (obj: UserRoleApiType) => UserRole;

  public constructor() {
    super(
      (obj: UserRoleApiType) => UserRole.fromResponse(obj),
      (a: UserRole, b: UserRole) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<UserRole, UserRole>): RolesLocalState {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }
}