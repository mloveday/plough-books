import {UserAbstract, UserApiType, UserInputType, UserUpdateType} from "../../../DataEntry/User/State/UserTypes";
import {EditableEntity} from "../../../State/EditableEntity";

export class UserInputs extends UserAbstract<string, undefined> implements UserInputType, EditableEntity {
  public static default() {
    return new UserInputs('', false, false);
  }
  public static fromResponse(json: UserApiType): UserInputs {
    return new UserInputs(json.email, json.whitelisted, json.blacklisted);
  }

  constructor(email: string, whitelisted: boolean, blacklisted: boolean) {
    super(email, whitelisted, blacklisted, undefined);
  }

  public with(obj: UserUpdateType) {
    return new UserInputs(
      obj.email ? obj.email : this.email,
      obj.whitelisted ? obj.whitelisted : this.whitelisted,
      obj.blacklisted ? obj.blacklisted : this.blacklisted,
    );
  }

  public get entityId() {
    return -1;
  }
}