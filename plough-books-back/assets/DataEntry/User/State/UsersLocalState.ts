import {User} from "../../../Auth/Model/User";

export class UsersLocalState {
  public static default() {
    return new UsersLocalState();
  }

  private static NOT_EDITING_ID = -1;

  public readonly editingUserId: number = UsersLocalState.NOT_EDITING_ID;
  public readonly isCreatingUser: boolean = false;
  public readonly users: User[] = [];
  public readonly newUser: User;

  public withNewUser(user: User) {
    return this.with({
      isCreatingUser: true,
      users: this.users.map(m => m.with({})),
      newUser: user,
    });
  }
  
  public withUsers(obj: any[], editingUserId: number = UsersLocalState.NOT_EDITING_ID) {
    const newUsers = new Map<number, User>();
    obj.forEach(v => {
      newUsers.set(v.id, User.default().with(v))
    });
    const users = new Map<number, User>();
    this.users.forEach(v => {
      const user = newUsers.get(v.userId);
      users.set(v.userId, user ? user : v.with({}));
    });
    newUsers.forEach((v,k) => users.set(k, v));
    return Object.assign(
      new UsersLocalState(),
      this,
      {
        editingUserId,
        users: Array.from(users.values()).sort((a: User, b: User) => a.email > b.email ? 1 : -1)
      }
    );
  }

  public with(obj: any) {
    return Object.assign(
      new UsersLocalState(),
      this,
      obj,
    );
  }

  public isEditing() {
    return this.editingUserId !== UsersLocalState.NOT_EDITING_ID;
  }
}