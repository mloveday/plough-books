import {User} from "../../../Auth/Model/User";
import {EditableLocalState} from "../../../State/EditableLocalState";

export class UsersLocalState extends EditableLocalState<User> {
  public static default() {
    return new UsersLocalState();
  }

  public constructor() {
    super(
      (obj: any) => User.default().with(obj),
      (a: User, b: User) => a.email > b.email ? 1 : -1
    );
  }

  public with(obj: any) {
    return Object.assign(
      new UsersLocalState(),
      this,
      obj,
    );
  }
}