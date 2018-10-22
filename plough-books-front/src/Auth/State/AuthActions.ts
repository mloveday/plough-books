import {createAction} from "redux-actions";
import {AuthenticatedUserResponse} from '../Model/AuthenticatedUserResponse';
import {User} from "../Model/User";
import {getCurrentUser} from "../Repo/CurrentUserRepo";
import {
getResponseFromLocalStorage,
removeAuthFromLocalStorage,
storeAuthInLocalStorage
} from './AuthStorage';

export const AUTH_CLEAR = "AUTH_CLEAR";
export const AUTH_SET = "AUTH_SET";
export const CURRENT_USER_RIGHTS = "CURRENT_USER_RIGHTS";

const clearAuthenticationState = createAction<void>(AUTH_CLEAR);
const setAuthentication = createAction<AuthenticatedUserResponse>(AUTH_SET);
const setCurrentLoginRights = createAction<User>(CURRENT_USER_RIGHTS);

export const handleAuthenticationResponse = (response: any) => {
    return (dispatch: any) => {
        storeAuthInLocalStorage(response);
        dispatch(setAuthentication(AuthenticatedUserResponse.fromResponse(response)));
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
        dispatch(clearAuthenticationState(undefined));
    }
};

export const fetchCurrentUser = () => {
    return (dispatch: any) => {
        getCurrentUser(() => dispatch(clearAuthentication()))
            .then((user: any) => dispatch(setCurrentLoginRights(user)));
    }
};