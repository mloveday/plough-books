import {authenticatedFetch} from "./AuthenticatedFetch";
import {User} from "./User";

export function getCurrentUser(onAuthError: () => void): Promise<User> {
  return authenticatedFetch(`/users/user`, onAuthError)
      .then((data: any) => User.fromResponse(data));
}