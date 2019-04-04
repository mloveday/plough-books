import {User} from "../../../Common/Auth/Model/User";
import {EditableLocalState} from "../../../State/EditableLocalState";
import {UserApiType} from "./UserTypes";

export class UsersLocalState extends EditableLocalState<User, User> {
  public static default() {
    return new UsersLocalState();
  }

  public constructor() {
    super(
      (obj: UserApiType) => User.fromResponse(obj),
      (a: User, b: User) => a.email > b.email ? 1 : -1
    );
  }

  public with(obj: EditableLocalState<User, User>) {
    return Object.assign(
      new UsersLocalState(),
      this,
      obj,
    );
  }
}