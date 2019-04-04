import {EditableEntity} from "../../../State/EditableEntity";
import {IRoleApiObject, Role} from "./Role";

export interface IApiUserNotPersistedObject {
  email?: string;
  whitelisted?: boolean;
  blacklisted?: boolean;
  role?: IRoleApiObject;
}

export class UserNotPersisted extends EditableEntity {

  public static default() {
    return new UserNotPersisted('', false, false, Role.default());
  }

  public readonly email: string;
  public readonly whitelisted: boolean;
  public readonly blacklisted: boolean;
  public readonly role: Role;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: Role) {
    super();
    this.email = email;
    this.whitelisted = whitelisted;
    this.blacklisted = blacklisted;
    this.role = role;
  }

  public with(obj: IApiUserNotPersistedObject) {
    return new UserNotPersisted(
      obj.email ? obj.email : this.email,
      obj.whitelisted ? obj.whitelisted : this.whitelisted,
      obj.blacklisted ? obj.blacklisted : this.blacklisted,
      obj.role ? this.role.with(obj.role) : this.role.clone(),
    );
  }

  public get entityId(): number {
    return -1;
  }
}