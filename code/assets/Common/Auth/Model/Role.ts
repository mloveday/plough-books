import {IRoleNotPersistedUpdateObject, RoleNotPersisted} from "./RoleNotPersisted";

export interface IRoleUpdateObject extends IRoleNotPersistedUpdateObject {
  id?: number;
}
export interface IRoleApiObject {
  id: number;
  role: string;
  managesUsers: boolean;
}

export class Role extends RoleNotPersisted {

  public static fromResponse(json: IRoleApiObject): Role {
    return new Role(json.role, json.managesUsers, json.id);
  }

  public readonly role: string;
  public readonly managesUsers: boolean;
  public readonly id: number;

  constructor(role: string, managesUsers: boolean, id: number) {
    super(role, managesUsers);
    this.id = id;
  }

  public clone(): Role {
    return new Role(this.role, this.managesUsers, this.id);
  }

  public with(obj: IRoleUpdateObject): Role {
    return new Role(
      obj.role ? obj.role : this.role,
      obj.managesUsers ? obj.managesUsers : this.managesUsers,
      obj.id ? obj.id : this.id
    );
  }

  public get entityId(): number {
    return this.id;
  }

  public isValid() {
    return true;
  }
}