import {EditableEntity} from "../../State/EditableEntity";
import {UserRole} from "../UserRole/UserRole";
import {UserInputs} from "./UserInputs";
import {UserAbstract, UserApiType, UserType, UserUpdateType} from "./UserTypes";

export class User extends UserAbstract<number, UserRole> implements EditableEntity, UserType {
  public static default() {
    return new User('', false, false, UserRole.default());
  }
  public static fromResponse(json: UserApiType): User {
    return new User(json.email, json.whitelisted, json.blacklisted, UserRole.fromResponse(json.role), json.id);
  }

  public readonly id?: number;
  public readonly inputs: UserInputs;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: UserRole, id?: number) {
    super(email, whitelisted, blacklisted, role);
    this.id = id;
  }

  public with(obj: UserUpdateType): User {
    return new User(
      obj.email ? obj.email : this.email,
      obj.whitelisted !== undefined ? obj.whitelisted : this.whitelisted,
      obj.blacklisted !== undefined ? obj.blacklisted : this.blacklisted,
      obj.role ? obj.role : this.role.clone(),
      this.id,
    );
  }

  public get entityId(): number {
    return this.id ? this.id : -1;
  }
}