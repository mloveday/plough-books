import * as log from "loglevel";
import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {UserRole} from "../../Model/UserRole/UserRole";
import {UserRoleApiType} from "../../Model/UserRole/UserRoleTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {UserRolesExternalState} from "./UserRolesExternalState";
import {UserRolesLocalState} from "./UserRolesLocalState";

const USER_ROLES_DATA_ENTRY = 'USER_ROLES_DATA_ENTRY';

const USER_ROLES_FETCH_START = 'USER_ROLES_FETCH_START';
const USER_ROLES_FETCH_SUCCESS = 'USER_ROLES_FETCH_SUCCESS';
const USER_ROLES_FETCH_ERROR = 'USER_ROLES_FETCH_ERROR';

const USER_ROLES_CREATE_START = 'USER_ROLES_CREATE_START';
const USER_ROLES_CREATE_SUCCESS = 'USER_ROLES_CREATE_SUCCESS';
const USER_ROLES_CREATE_ERROR = 'USER_ROLES_CREATE_ERROR';

export const userRolesDataEntry = createAction<UserRolesLocalState>(USER_ROLES_DATA_ENTRY);

export const userRolesFetchStart = createAction(USER_ROLES_FETCH_START);
export const userRolesFetchSuccess = createAction<UserRole[]>(USER_ROLES_FETCH_SUCCESS);
export const userRolesFetchError = createAction(USER_ROLES_FETCH_ERROR);

export const userRolesCreateStart = createAction<UserRole>(USER_ROLES_CREATE_START);
export const userRolesCreateSuccess = createAction<UserRole[]>(USER_ROLES_CREATE_SUCCESS);
export const userRolesCreateError = createAction(USER_ROLES_CREATE_ERROR);

export const userRolesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(userRolesFetch());
    dispatch(userRolesFetchStart());
    return authenticatedFetch(`/users/roles`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: UserRoleApiType[]) => dispatch(userRolesFetchSuccess(d.map(obj => UserRole.fromResponse(obj)))))
      .catch(e => dispatch(userRolesFetchError(e)))
      ;
  }
};

export const userRolesCreate = (role: UserRole) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(userRolesCreate(role));
    dispatch(userRolesCreateStart(role));
    return authenticatedFetch('/users/role', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(role),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then((d: UserRoleApiType[]) => dispatch(userRolesFetchSuccess(d.map(obj => UserRole.fromResponse(obj)))))
      .catch(e => dispatch(userRolesCreateError(e)))
      ;
  }
};

export const userRolesInternalReducers = handleActions<UserRolesLocalState, any>({
  [USER_ROLES_DATA_ENTRY]: (state, action: DefinedAction<UserRolesLocalState>) => {
    return state.with(action.payload);
  },
  [USER_ROLES_FETCH_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return UserRolesLocalState.default().withEntities(action.payload);
  },
  [USER_ROLES_CREATE_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return UserRolesLocalState.default().withEntities(action.payload);
  }
}, UserRolesLocalState.default());

export const userRolesExternalReducers = handleActions<UserRolesExternalState, any>({
  [USER_ROLES_FETCH_START]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [USER_ROLES_FETCH_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [USER_ROLES_FETCH_ERROR]: (state, action: DefinedAction<any>) => {
    log.error(action.payload);
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [USER_ROLES_CREATE_START]: (state, action: DefinedAction<void>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [USER_ROLES_CREATE_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [USER_ROLES_CREATE_ERROR]: (state, action: DefinedAction<any>) => {
    log.error(action.payload);
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

}, new UserRolesExternalState());