import {Role} from "../../../Model/UserRole/Role";
import {RoleApiType} from "../../../Model/UserRole/RoleTypes";
import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";

export class RolesLocalState extends EditableLocalState<Role, Role> {
  public static default() {
    return new RolesLocalState();
  }
  protected readonly fromObjFn: (obj: RoleApiType) => Role;

  public constructor() {
    super(
      (obj: RoleApiType) => Role.fromResponse(obj),
      (a: Role, b: Role) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<Role, Role>): RolesLocalState {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }
}