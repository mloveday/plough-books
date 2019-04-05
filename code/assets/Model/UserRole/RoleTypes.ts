import {ApiType, EntityType, InputType, UpdateType} from "../../State/TypeWithNumericalInputs";

export abstract class RoleAbstract<T> {
  public readonly role: string;
  public readonly managesUsers: boolean;

  constructor(role: string, managesUsers: boolean) {
    this.role = role;
    this.managesUsers = managesUsers;
  }
}
export type RoleApiType = ApiType<RoleAbstract<number>>;
export type RoleUpdateType = UpdateType<RoleAbstract<string>>;
export type RoleInputType = InputType<RoleAbstract<string>>;
export type RoleType = EntityType<RoleAbstract<number>, RoleAbstract<string>>;