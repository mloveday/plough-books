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
      obj.role ? obj.role : this.role,
      obj.managesUsers ? obj.managesUsers : this.managesUsers
    );
  }
}