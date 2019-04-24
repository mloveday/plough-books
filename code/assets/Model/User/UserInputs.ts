import {UserAbstract, UserApiType, UserInputType, UserUpdateType} from "./UserTypes";

export class UserInputs extends UserAbstract<string, undefined> implements UserInputType {
  public static default() {
    return new UserInputs('', false, false);
  }
  public static fromApi(json: UserApiType): UserInputs {
    return new UserInputs(json.email, json.whitelisted, json.blacklisted);
  }

  constructor(email: string, whitelisted: boolean, blacklisted: boolean) {
    super(email, whitelisted, blacklisted, undefined);
  }

  public with(obj: UserUpdateType): UserInputs {
    return new UserInputs(
      obj.email !== undefined ? obj.email : this.email,
      obj.whitelisted !== undefined ? obj.whitelisted : this.whitelisted,
      obj.blacklisted !== undefined ? obj.blacklisted : this.blacklisted,
    );
  }
}