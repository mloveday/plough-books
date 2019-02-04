import {IApiRoleNotPersistedObject, RoleNotPersisted} from "./RoleNotPersisted";

export interface IApiRoleObject extends IApiRoleNotPersistedObject {
  id?: number;
}

export class Role extends RoleNotPersisted {

  public static fromResponse(json: any): Role {
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

  public with(obj: IApiRoleObject): Role {
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