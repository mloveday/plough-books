import {IApiUserObject, User} from "../../../Common/Auth/Model/User";
import {UserNotPersisted} from "../../../Common/Auth/Model/UserNotPersisted";
import {EditableDualLocalState} from "../../../State/EditableDualLocalState";

export class UsersLocalState extends EditableDualLocalState<UserNotPersisted, User> {
  public static default() {
    return new UsersLocalState();
  }

  public constructor() {
    super(
      (obj: IApiUserObject) => User.fromResponse(obj),
      (a: User, b: User) => a.email > b.email ? 1 : -1
    );
  }

  public with(obj: EditableDualLocalState<UserNotPersisted, User>) {
    return Object.assign(
      new UsersLocalState(),
      this,
      obj,
    );
  }
}