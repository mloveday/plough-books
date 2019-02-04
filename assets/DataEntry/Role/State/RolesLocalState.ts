import {Role} from "../../../Common/Auth/Model/Role";
import {RoleNotPersisted} from "../../../Common/Auth/Model/RoleNotPersisted";
import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";

export class RolesLocalState extends EditableLocalState<RoleNotPersisted, Role> {
  public static default() {
    return new RolesLocalState();
  }

  public constructor() {
    super(
      obj => Role.fromResponse(obj),
      (a: Role, b: Role) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<RoleNotPersisted, Role>): RolesLocalState {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }
}