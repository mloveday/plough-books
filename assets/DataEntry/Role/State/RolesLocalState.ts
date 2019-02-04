import {Role} from "../../../Common/Auth/Model/Role";
import {RoleNotPersisted} from "../../../Common/Auth/Model/RoleNotPersisted";
import {EditableDualLocalState, IApiEditableDualLocalState} from "../../../State/EditableDualLocalState";

export class RolesLocalState extends EditableDualLocalState<RoleNotPersisted, Role> {
  public static default() {
    return new RolesLocalState();
  }

  public constructor() {
    super(
      obj => Role.fromResponse(obj),
      (a: Role, b: Role) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableDualLocalState<RoleNotPersisted, Role>): RolesLocalState {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }
}