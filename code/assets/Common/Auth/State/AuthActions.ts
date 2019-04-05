import {createAction} from "redux-actions";
import {AuthenticatedUserResponse} from '../Model/AuthenticatedUserResponse';
import {User} from "../../../Model/User/User";
import {getCurrentUser} from "../Repo/CurrentUserRepo";
import {getResponseFromLocalStorage, removeAuthFromLocalStorage, storeAuthInLocalStorage} from './AuthStorage';

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
        getCurrentUser(() => dispatch(invalidUser(onLoginDispatch)))
            .then((user: User) => {
              dispatch(setCurrentLoginRights(user));
              onLoginDispatch.forEach(f => f());
            });
    }
};