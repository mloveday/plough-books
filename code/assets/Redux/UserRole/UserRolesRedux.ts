import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {UserRole} from "../../Model/UserRole/UserRole";
import {UserRoleApiType} from "../../Model/UserRole/UserRoleTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {UserRolesExternalState} from "./UserRolesExternalState";
import {UserRolesLocalState} from "./UserRolesLocalState";

const USER_ROLES_DATA_ENTRY = 'USER_ROLES_DATA_ENTRY';

const USER_ROLES_FETCH_START = 'USER_ROLES_FETCH_START';
const USER_ROLES_FETCH_SUCCESS = 'USER_ROLES_FETCH_SUCCESS';
export const USER_ROLES_FETCH_ERROR = 'USER_ROLES_FETCH_ERROR';

const USER_ROLES_CREATE_START = 'USER_ROLES_CREATE_START';
const USER_ROLES_CREATE_SUCCESS = 'USER_ROLES_CREATE_SUCCESS';
export const USER_ROLES_CREATE_ERROR = 'USER_ROLES_CREATE_ERROR';

export const userRolesDataEntry = createAction<UserRolesLocalState>(USER_ROLES_DATA_ENTRY);

export const userRolesFetchStart = createAction(USER_ROLES_FETCH_START);
export const userRolesFetchSuccess = createAction<UserRole[]>(USER_ROLES_FETCH_SUCCESS);
export const userRolesFetchError = createAction<ErrorPayload>(USER_ROLES_FETCH_ERROR);

export const userRolesCreateStart = createAction<UserRole>(USER_ROLES_CREATE_START);
export const userRolesCreateSuccess = createAction<UserRole[]>(USER_ROLES_CREATE_SUCCESS);
export const userRolesCreateError = createAction<ErrorPayload>(USER_ROLES_CREATE_ERROR);

export const userRolesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(userRolesFetch());
    dispatch(userRolesFetchStart());
    return authenticatedFetch(`/users/roles`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: UserRoleApiType[]) => d.map(obj => UserRole.fromApi(obj)))
      .then(d => dispatch(userRolesFetchSuccess(d)))
      .catch(e => dispatch(userRolesFetchError({error: e, appArea: 'User Roles fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const userRolesCreate = (role: UserRole) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(userRolesCreate(role));
    dispatch(userRolesCreateStart(role));
    return authenticatedFetch('/users/role', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(role),'POST')
      .then((d: UserRoleApiType[]) => d.map(obj => UserRole.fromApi(obj)))
      .then(d => dispatch(userRolesFetchSuccess(d)))
      .catch(e => dispatch(userRolesCreateError({error: e, appArea: 'User Roles post', dispatch: thisDispatchable})))
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
    return new UserRolesExternalState(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [USER_ROLES_FETCH_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return new UserRolesExternalState(UserRolesLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK));
  },
  [USER_ROLES_FETCH_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new UserRolesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [USER_ROLES_CREATE_START]: (state, action: DefinedAction<void>) => {
    return new UserRolesExternalState(state.externalState, state.updatedState(FetchStatus.STARTED, 'post'));
  },
  [USER_ROLES_CREATE_SUCCESS]: (state, action: DefinedAction<UserRole[]>) => {
    return new UserRolesExternalState(UserRolesLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK, 'post'));
  },
  [USER_ROLES_CREATE_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new UserRolesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR, 'post'));
  },

}, new UserRolesExternalState());