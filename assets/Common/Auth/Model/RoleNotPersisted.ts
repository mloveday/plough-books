import {EditableEntity} from "../../../State/EditableEntity";

export interface IRoleNotPersistedUpdateObject {
  role?: string;
  managesUsers?: boolean;
}

export class RoleNotPersisted extends EditableEntity {

  public static default() {
    return new RoleNotPersisted('', false);
  }

  public readonly role: string;
  public readonly managesUsers: boolean;

  constructor(role: string, managesUsers: boolean) {
    super();
    this.role = role;
    this.managesUsers = managesUsers;
  }

  public clone() {
    return new RoleNotPersisted(this.role, this.managesUsers);
  }

  public with(obj: IRoleNotPersistedUpdateObject): RoleNotPersisted {
    return Object.assign(RoleNotPersisted.default(), this, obj);
  }

  public get entityId() {
    return -1;
  }

  public isValid() {
    return false;
  }
}