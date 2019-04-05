import {EditableEntity} from "../../State/EditableEntity";
import {UserRoleInputs} from "./UserRoleInputs";
import {UserRoleAbstract, UserRoleApiType, UserRoleType, UserRoleUpdateType} from "./UserRoleTypes";

export class UserRole extends UserRoleAbstract<number> implements UserRoleType, EditableEntity {
  public static default() {
    return new UserRole('', false, UserRoleInputs.default());
  }
  public static fromResponse(json: UserRoleApiType): UserRole {
    return new UserRole(json.role, json.managesUsers, UserRoleInputs.fromResponse(json), json.id);
  }

  public readonly id?: number;
  public readonly inputs: UserRoleInputs;

  constructor(role: string, managesUsers: boolean, inputs: UserRoleInputs, id?: number) {
    super(role, managesUsers);
    this.id = id;
    this.inputs = inputs;
  }

  public clone(): UserRole {
    return new UserRole(this.role, this.managesUsers, this.inputs.with({}), this.id);
  }

  public with(obj: UserRoleUpdateType): UserRole {
    return new UserRole(
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