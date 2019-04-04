import {Role} from "../../../Common/Auth/Model/Role";
import {RoleApiType} from "../../../Common/Auth/Model/RoleTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../../../State/TypeWithNumericalInputs";

export abstract class UserAbstract<T, R> {
  public readonly email: string;
  public readonly whitelisted: boolean;
  public readonly blacklisted: boolean;
  public readonly role: R;

  constructor(email: string, whitelisted: boolean, blacklisted: boolean, role: R) {
    this.email = email;
    this.whitelisted = whitelisted;
    this.blacklisted = blacklisted;
    this.role = role;
  }
}
export type UserApiType = ApiType<UserAbstract<number, RoleApiType>>;
export type UserUpdateType = UpdateType<UserAbstract<string, Role>>;
export type UserInputType = InputType<UserAbstract<string, undefined>>;
export type UserType = EntityType<UserAbstract<number, Role>, UserAbstract<string, undefined>>;