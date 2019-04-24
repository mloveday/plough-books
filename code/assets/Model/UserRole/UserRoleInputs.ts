import {UserRoleAbstract, UserRoleApiType, UserRoleInputType, UserRoleUpdateType} from "./UserRoleTypes";

export class UserRoleInputs extends UserRoleAbstract<number> implements UserRoleInputType {
  public static default() {
    return new UserRoleInputs('', false);
  }
  public static fromApi(json: UserRoleApiType): UserRoleInputs {
    return new UserRoleInputs(json.role, json.managesUsers);
  }

  public with(obj: UserRoleUpdateType): UserRoleInputs {
    return new UserRoleInputs(
      obj.role !== undefined ? obj.role : this.role,
      obj.managesUsers !== undefined ? obj.managesUsers : this.managesUsers
    );
  }
}