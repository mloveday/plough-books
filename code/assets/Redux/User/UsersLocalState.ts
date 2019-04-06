import {User} from "../../Model/User/User";
import {EditableLocalState} from "../EditableLocalState";
import {UserApiType} from "../../Model/User/UserTypes";

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