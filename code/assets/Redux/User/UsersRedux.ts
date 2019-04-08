import * as log from "loglevel";
import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {User} from "../../Model/User/User";
import {UserApiType} from "../../Model/User/UserTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {UsersExternalState} from "./UsersExternalState";
import {UsersLocalState} from "./UsersLocalState";

const USERS_DATA_ENTRY = 'USERS_DATA_ENTRY';

const USERS_FETCH_START = 'USERS_FETCH_START';
const USERS_FETCH_SUCCESS = 'USERS_FETCH_SUCCESS';
const USERS_FETCH_ERROR = 'USERS_FETCH_ERROR';

const USERS_CREATE_START = 'USERS_CREATE_START';
const USERS_CREATE_SUCCESS = 'USERS_CREATE_SUCCESS';
const USERS_CREATE_ERROR = 'USERS_CREATE_ERROR';

export const usersDataEntry = createAction<UsersLocalState>(USERS_DATA_ENTRY);

export const usersFetchStart = createAction(USERS_FETCH_START);
export const usersFetchSuccess = createAction<User[]>(USERS_FETCH_SUCCESS);
export const usersFetchError = createAction(USERS_FETCH_ERROR);

export const usersCreateStart = createAction<User>(USERS_CREATE_START);
export const usersCreateSuccess = createAction<User[]>(USERS_CREATE_SUCCESS);
export const usersCreateError = createAction(USERS_CREATE_ERROR);

export const usersFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(usersFetch());
    dispatch(usersFetchStart());
    return authenticatedFetch(`/users`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: UserApiType[]) => d.map(obj => User.fromApi(obj)))
      .then(d => dispatch(usersFetchSuccess(d)))
      .catch(e => dispatch(usersFetchError(e)))
      ;
  }
};

export const usersCreate = (user: User) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(usersCreate(user));
    dispatch(usersCreateStart(user));
    return authenticatedFetch('/users/user', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(user),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then((d: UserApiType[]) => d.map(obj => User.fromApi(obj)))
      .then(d => dispatch(usersCreateSuccess(d)))
      .catch(e => dispatch(usersCreateError(e)))
      ;
  }
};

export const usersInternalReducers = handleActions<UsersLocalState, any>({
  [USERS_DATA_ENTRY]: (state, action: DefinedAction<UsersLocalState>) => {
    return state.with(action.payload);
  },
  [USERS_FETCH_SUCCESS]: (state, action: DefinedAction<User[]>) => {
    return UsersLocalState.default().withEntities(action.payload);
  },
  [USERS_CREATE_SUCCESS]: (state, action: DefinedAction<User[]>) => {
    return UsersLocalState.default().withEntities(action.payload);
  }
}, UsersLocalState.default());

export const usersExternalReducers = handleActions<UsersExternalState, any>({
  [USERS_FETCH_START]: (state, action: DefinedAction<void>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [USERS_FETCH_SUCCESS]: (state, action: DefinedAction<User[]>) => {
    return state.with(UsersLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [USERS_FETCH_ERROR]: (state, action: DefinedAction<any>) => {
    log.error(action.payload);
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [USERS_CREATE_START]: (state, action: DefinedAction<void>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [USERS_CREATE_SUCCESS]: (state, action: DefinedAction<User[]>) => {
    return state.with(UsersLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [USERS_CREATE_ERROR]: (state, action: DefinedAction<any>) => {
    log.error(action.payload);
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

  }, new UsersExternalState());