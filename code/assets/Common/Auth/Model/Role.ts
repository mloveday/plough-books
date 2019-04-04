import {EditableEntity} from "../../../State/EditableEntity";
import {RoleAbstract, RoleApiType, RoleInputType, RoleType, RoleUpdateType} from "./RoleTypes";

export class Role extends RoleAbstract<number> implements RoleType, EditableEntity {
  public static default() {
    return new Role('', false);
  }
  public static fromResponse(json: RoleApiType): Role {
    return new Role(json.role, json.managesUsers, json.id);
  }

  public readonly id?: number;
  public readonly inputs: RoleInputType; // todo set this

  constructor(role: string, managesUsers: boolean, id?: number) {
    super(role, managesUsers);
    this.id = id;
    this.inputs
  }

  public clone(): Role {
    return new Role(this.role, this.managesUsers, this.id);
  }

  public with(obj: RoleUpdateType): Role {
    return new Role(
      obj.role ? obj.role : this.role,
      obj.managesUsers !== undefined ? obj.managesUsers : this.managesUsers,
      this.id
    );
  }

  public get entityId(): number {
    return this.id ? this.id : -1;
  }

  public isValid() {
    return this.id !== undefined;
  }
}