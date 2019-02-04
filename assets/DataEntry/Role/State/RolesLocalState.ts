import {Role} from "../../../Common/Auth/Model/Role";
import {EditableLocalState, IApiEditableLocalState} from "../../../State/EditableLocalState";

export class RolesLocalState extends EditableLocalState<Role> {
  public static default() {
    return new RolesLocalState();
  }

  public constructor() {
    super(
      obj => Role.default().with(obj),
      (a: Role, b: Role) => a.role > b.role ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<Role>) {
    return Object.assign(
      new RolesLocalState(),
      this,
      obj,
    );
  }
}