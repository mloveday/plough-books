import {createAction, handleActions} from "redux-actions";
import {User} from "../../Model/User/User";
import {AuthenticatedUserResponse} from "./Model/AuthenticatedUserResponse";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {AuthState} from "./AuthState";
import {getResponseFromLocalStorage, removeAuthFromLocalStorage, storeAuthInLocalStorage} from "./AuthStorage";

export const AUTH_CLEAR = "AUTH_CLEAR";
export const AUTH_INVALID = "AUTH_INVALID";
export const AUTH_SET = "AUTH_SET";
export const AUTH_CLEAR_DISPATCH = "AUTH_CLEAR_DISPATCH";
export const CURRENT_USER_RIGHTS = "CURRENT_USER_RIGHTS";

const clearAuthenticationState = createAction(AUTH_CLEAR);
const setUnauthorised = createAction<Array<() => void>>(AUTH_INVALID);
const setAuthentication = createAction<AuthenticatedUserResponse>(AUTH_SET);
const clearLoginDispatch = createAction(AUTH_CLEAR_DISPATCH);
const setCurrentLoginRights = createAction<User>(CURRENT_USER_RIGHTS);

export const handleAuthenticationResponse = (response: any, onLoginDispatch: Array<() => void>) => {
  return (dispatch: any) => {
    storeAuthInLocalStorage(response);
    dispatch(setAuthentication(AuthenticatedUserResponse.fromResponse(response)));
    dispatch(clearLoginDispatch());
    dispatch(fetchCurrentUser(onLoginDispatch));
  }
};

export const bootstrapFromLocalStorage = () => {
  return (dispatch: any) => {
    const response = getResponseFromLocalStorage();
    if (response) {
      dispatch(setAuthentication(AuthenticatedUserResponse.fromResponse(response)));
    }
  }
};

export const clearAuthentication = () => {
  return (dispatch: any) => {
    removeAuthFromLocalStorage();
    dispatch(clearAuthenticationState());
  }
};

export const invalidUser = (onLoginDispatch: Array<() => void>) => {
  return (dispatch: any) => {
    dispatch(setUnauthorised(onLoginDispatch));
  }
};

export const fetchCurrentUser = (onLoginDispatch: Array<() => void>) => {
  return (dispatch: any) => {
    authenticatedFetch(`/users/user`, () => dispatch(invalidUser(onLoginDispatch)))
      .then((data: any) => User.fromResponse(data))
      .then((user: User) => {
        dispatch(setCurrentLoginRights(user));
        onLoginDispatch.forEach(f => f());
      });
  }
};

export const authReducer = handleActions<AuthState, any>({
  [AUTH_CLEAR]: () => {
    return AuthState.cleared();
  },
  [AUTH_INVALID]: (state, action) => {
    return state.withUnauthorisedUser(action.payload);
  },
  [AUTH_SET]: (state, action) => {
    return state.withAuthentication(action.payload);
  },
  [AUTH_CLEAR_DISPATCH]: (state, action) => {
    return state.withNoDispatchables();
  },
  [CURRENT_USER_RIGHTS]: (state, action) => { // must be logged in to get a response - state must already have auth credentials
    return state.withUser(action.payload);
  },
}, AuthState.cleared());