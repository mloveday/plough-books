import {EditableEntity} from "../../../State/EditableEntity";
import {RoleAbstract, RoleApiType, RoleInputType, RoleUpdateType} from "./RoleTypes";

export class RoleInputs extends RoleAbstract<number> implements RoleInputType, EditableEntity {
  public static default() {
    return new RoleInputs('', false);
  }
  public static fromResponse(json: RoleApiType): RoleInputs {
    return new RoleInputs(json.role, json.managesUsers);
  }

  constructor(role: string, managesUsers: boolean) {
    super(role, managesUsers);
  }

  public with(obj: RoleUpdateType): RoleInputs {
    return new RoleInputs(
      obj.role ? obj.role : this.role,
      obj.managesUsers ? obj.managesUsers : this.managesUsers
    );
  }

  public get entityId() {
    return -1;
  }
}