import {EditableEntity} from "../EditableEntity";
import {UserRole} from "../UserRole/UserRole";
import {UserInputs} from "./UserInputs";
import {UserAbstract, UserApiType, UserType, UserUpdateType} from "./UserTypes";

export class User extends UserAbstract<number, UserRole> implements EditableEntity, UserType {
  public static default() {
    return new User('', false, false, UserRole.default(), UserInputs.default(), undefined);
  }
  public static fromApi(json: UserApiType): User {
    return new User(json.email, json.whitelisted, json.blacklisted, UserRole.fromApi(json.role), UserInputs.fromApi(json), json.id);
  }

  public readonly id?: number;
  public readonly inputs: UserInputs;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: UserRole, inputs: UserInputs, id?: number) {
    super(email, whitelisted, blacklisted, role);
    this.inputs = inputs;
    this.id = id;
  }

  public with(obj: UserUpdateType): User {
    return new User(
      obj.email !== undefined ? obj.email : this.email,
      obj.whitelisted !== undefined ? obj.whitelisted : this.whitelisted,
      obj.blacklisted !== undefined ? obj.blacklisted : this.blacklisted,
      obj.role !== undefined ? obj.role : this.role.clone(),
      this.inputs.with(obj),
      this.id);
  }

  public clone(): User {
    return this.with({});
  }

  public get entityId(): number {
    return this.id ? this.id : -1;
  }
}