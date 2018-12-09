import {User} from "../Model/User";
import {authenticatedFetch} from "./AuthenticatedFetch";

export function getCurrentUser(onAuthError: () => void): Promise<User> {
  return authenticatedFetch(`/users/user`, onAuthError)
      .then((data: any) => User.fromResponse(data));
}