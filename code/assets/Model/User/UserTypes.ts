import {UserRole} from "../UserRole/UserRole";
import {UserRoleApiType} from "../UserRole/UserRoleTypes";
import {ApiType, EntityType, InputType, UpdateType} from "../TypeWithNumericalInputs";

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
export type UserApiType = ApiType<UserAbstract<number, UserRoleApiType>>;
export type UserUpdateType = UpdateType<UserAbstract<string, UserRole>>;
export type UserInputType = InputType<UserAbstract<string, undefined>>;
export type UserType = EntityType<UserAbstract<number, UserRole>, UserAbstract<string, undefined>>;