import {IRoleApiObject, IRoleUpdateObject, Role} from "./Role";
import {IApiUserNotPersistedObject, UserNotPersisted} from "./UserNotPersisted";

export interface IUserApiObject {
  id: number;
  role: IRoleApiObject;
  email: string;
  whitelisted: boolean;
  blacklisted: boolean;
}

export interface IUserUpdateObject extends IApiUserNotPersistedObject {
  id?: number;
  role?: IRoleUpdateObject;
}

export class User extends UserNotPersisted {

  public static fromResponse(json: IUserApiObject): User {
    return new User(json.email, json.whitelisted, json.blacklisted, Role.fromResponse(json.role), json.id);
  }

  public readonly role: Role;
  public readonly id: number;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: Role, id: number) {
    super(email, whitelisted, blacklisted, role);
    this.id = id;
  }

  public with(obj: IUserUpdateObject) {
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