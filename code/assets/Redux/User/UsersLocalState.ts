import {User} from "../../Model/User/User";
import {UserApiType} from "../../Model/User/UserTypes";
import {EditableLocalState, IApiEditableLocalState} from "../EditableLocalState";

export class UsersLocalState extends EditableLocalState<User> {
  public static default() {
    return new UsersLocalState();
  }

  public constructor() {
    super(
      (obj: UserApiType) => User.fromResponse(obj),
      (a: User, b: User) => a.email > b.email ? 1 : -1
    );
  }

  public with(obj: IApiEditableLocalState<User>): UsersLocalState {
    return Object.assign(
      new UsersLocalState(),
      this,
      obj,
    );
  }

  public withEntities(obj: User[], editingEntityId: number = EditableLocalState.NOT_EDITING_ID): UsersLocalState {
    return this.with(this.getUpdatedEntitiesObject(obj, editingEntityId));
  }
  public withEntity(obj: User, editingEntityId: number = EditableLocalState.NOT_EDITING_ID): UsersLocalState {
    return this.with(this.getUpdatedEntityObject(obj));
  }
  public withNewEntity(obj: User): UsersLocalState {
    return this.with(this.getNewEntityObject(obj));
  }
}