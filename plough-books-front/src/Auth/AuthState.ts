import {AuthenticatedUserResponse} from './AuthenticatedUserResponse';
import {User} from "./User";

export class AuthState {
  public static cleared(): AuthState {
    return new AuthState(false, undefined, undefined);
  }

  public static withAuthentication(auth: AuthenticatedUserResponse): AuthState {
    return new AuthState(true, auth, undefined);
  }

  public readonly auth?: AuthenticatedUserResponse;
  public readonly currentUser?: User;
  private readonly initialised: boolean;

  constructor(initialised: boolean, auth?: AuthenticatedUserResponse, user?: User) {
    this.initialised = initialised;
    this.auth = auth;
    this.currentUser = user;
  }

  public withUser(user: User): AuthState {
      return new AuthState(true, this.auth ? this.auth.clone() : undefined, user);
  }

  public isValid(): boolean {
      return this.initialised;
  }

  public hasCurrentUser(): boolean {
      return !!this.currentUser;
  }

}