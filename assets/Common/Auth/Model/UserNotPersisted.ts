import {EditableEntity} from "../../../State/EditableEntity";
import {IRoleNotPersistedUpdateObject, RoleNotPersisted} from "./RoleNotPersisted";

export interface IApiUserNotPersistedObject {
  email?: string;
  whitelisted?: boolean;
  blacklisted?: boolean;
  role?: IRoleNotPersistedUpdateObject;
}

export class UserNotPersisted extends EditableEntity {

  public static default() {
    return new UserNotPersisted('', false, false, RoleNotPersisted.default());
  }

  public readonly email: string;
  public readonly whitelisted: boolean;
  public readonly blacklisted: boolean;
  public readonly role: RoleNotPersisted;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: RoleNotPersisted) {
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