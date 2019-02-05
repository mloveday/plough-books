import {IApiRoleObject, Role} from "./Role";
import {IApiUserNotPersistedObject, UserNotPersisted} from "./UserNotPersisted";

export interface IUserApiObject extends IApiUserNotPersistedObject {
  id?: number;
  role?: IApiRoleObject;
}

export class User extends UserNotPersisted {

  public static fromResponse(json: any): User {
    return new User(json.email, json.whitelisted, json.blacklisted, Role.fromResponse(json.role), json.id);
  }

  public readonly role: Role;
  public readonly id: number;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: Role, id: number) {
    super(email, whitelisted, blacklisted, role);
    this.id = id;
  }

  public with(obj: IUserApiObject) {
    return new User(
      obj.email ? obj.email : this.email,
      obj.whitelisted ? obj.whitelisted : this.whitelisted,
      obj.blacklisted ? obj.blacklisted : this.blacklisted,
      obj.role ? this.role.with(obj.role) : this.role.clone(),
      obj.id ? obj.id : this.id,
    );
  }

  public get entityId(): number {
    return this.id;
  }
}