import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

export abstract class UserRoleAbstract<T> {
  public readonly role: string;
  public readonly managesUsers: boolean;

  constructor(role: string, managesUsers: boolean) {
    this.role = role;
    this.managesUsers = managesUsers;
  }
}
export type UserRoleApiType = ApiType<UserRoleAbstract<number>>;
export type UserRoleUpdateType = UpdateType<UserRoleAbstract<string>>;
export type UserRoleInputType = InputType<UserRoleAbstract<string>>;
export type UserRoleType = EntityType<UserRoleAbstract<number>, UserRoleAbstract<string>>;