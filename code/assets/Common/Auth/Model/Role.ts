import {EditableEntity} from "../../../State/EditableEntity";
import {RoleInputs} from "./RoleInputs";
import {RoleAbstract, RoleApiType, RoleType, RoleUpdateType} from "./RoleTypes";

export class Role extends RoleAbstract<number> implements RoleType, EditableEntity {
  public static default() {
    return new Role('', false, RoleInputs.default());
  }
  public static fromResponse(json: RoleApiType): Role {
    return new Role(json.role, json.managesUsers, RoleInputs.fromResponse(json), json.id);
  }

  public readonly id?: number;
  public readonly inputs: RoleInputs;

  constructor(role: string, managesUsers: boolean, inputs: RoleInputs, id?: number) {
    super(role, managesUsers);
    this.id = id;
    this.inputs = inputs;
  }

  public clone(): Role {
    return new Role(this.role, this.managesUsers, this.inputs.with({}), this.id);
  }

  public with(obj: RoleUpdateType): Role {
    return new Role(
      obj.role ? obj.role : this.role,
      obj.managesUsers !== undefined ? obj.managesUsers : this.managesUsers,
      this.inputs.with(obj),
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