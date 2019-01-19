import {AuthenticatedUserResponse} from '../Model/AuthenticatedUserResponse';
import {User} from "../Model/User";

export class AuthState {
  public static cleared(): AuthState {
    return new AuthState(false, true, [], undefined, undefined);
  }

  public readonly auth?: AuthenticatedUserResponse;
  public readonly currentUser?: User;
  public readonly onLoginDispatch: Array<() => void> = [];
  private readonly initialised: boolean;
  private readonly valid: boolean;

  constructor(initialised: boolean, valid: boolean, onLoginDispatch: Array<() => void>, auth?: AuthenticatedUserResponse, user?: User) {
    this.initialised = initialised;
    this.auth = auth;
    this.currentUser = user;
    this.valid = valid;
    this.onLoginDispatch = onLoginDispatch;
  }

  public withAuthentication(auth: AuthenticatedUserResponse): AuthState {
    return new AuthState(true, this.valid, this.onLoginDispatch, auth, undefined);
  }

  public withUser(user: User): AuthState {
      return new AuthState(true, true, this.onLoginDispatch, this.auth ? this.auth.clone() : undefined, user);
  }

  public withUnauthorisedUser(onLoginDispatch: Array<() => void>): AuthState {
    return new AuthState(true, false, this.onLoginDispatch.concat(onLoginDispatch), this.auth ? this.auth.clone() : undefined, undefined);
  }

  public withNoDispatchables(): AuthState {
    return new AuthState(this.initialised, this.valid, [], this.auth, this.currentUser);
  }

  public isSignedIn(): boolean {
    return this.isInitialised();
  }

  public isSignedInAndWaitingAuthorisation(): boolean {
    return this.isInitialised() && this.isValid() && !this.hasCurrentUser();
  }

  public isSignedInAndAuthorised(): boolean {
    return this.isInitialised() && this.isValid() && this.hasCurrentUser();
  }

  public isSignedInAndUnauthorised(): boolean {
    return this.isInitialised() && !this.isValid();
  }

  private isInitialised(): boolean {
    return this.initialised;
  }

  private isValid(): boolean {
    return this.valid;
  }

  private hasCurrentUser(): boolean {
    return !!this.currentUser;
  }

}