import {handleActions} from "redux-actions";
import {AUTH_CLEAR, AUTH_SET, CURRENT_USER_RIGHTS} from "./AuthActions";
import {AuthState} from "./AuthState";

export const authReducer = handleActions<AuthState, any>({
    [AUTH_CLEAR]: () => {
        return AuthState.cleared();
    },
    [AUTH_SET]: (state, action) => {
        return AuthState.withAuthentication(action.payload);
    },
    [CURRENT_USER_RIGHTS]: (state, action) => { // must be logged in to get a response - state must already have auth credentials
        return state.withUser(action.payload);
    }
}, AuthState.cleared());