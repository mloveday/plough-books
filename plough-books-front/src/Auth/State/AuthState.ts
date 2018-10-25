import {AuthenticatedUserResponse} from '../Model/AuthenticatedUserResponse';
import {User} from "../Model/User";

export class AuthState {
  public static cleared(): AuthState {
    return new AuthState(false, true, undefined, undefined);
  }

  public readonly auth?: AuthenticatedUserResponse;
  public readonly currentUser?: User;
  private readonly initialised: boolean;
  private readonly valid: boolean;

  constructor(initialised: boolean, valid: boolean, auth?: AuthenticatedUserResponse, user?: User) {
    this.initialised = initialised;
    this.auth = auth;
    this.currentUser = user;
    this.valid = valid;
  }

  public withAuthentication(auth: AuthenticatedUserResponse): AuthState {
    return new AuthState(true, this.valid, auth, undefined);
  }

  public withUser(user: User): AuthState {
      return new AuthState(true, true, this.auth ? this.auth.clone() : undefined, user);
  }

  public withUnauthorisedUser(): AuthState {
    return new AuthState(true, false, this.auth ? this.auth.clone() : undefined, undefined);
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