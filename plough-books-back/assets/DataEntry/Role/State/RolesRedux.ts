import {createAction, handleActions} from "redux-actions";
import {Role} from "../../../Auth/Model/Role";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {RolesExternalState} from "./RolesExternalState";
import {RolesLocalState} from "./RolesLocalState";

const ROLES_DATA_ENTRY = 'ROLES_DATA_ENTRY';

const ROLES_FETCH_START = 'ROLES_FETCH_START';
const ROLES_FETCH_SUCCESS = 'ROLES_FETCH_SUCCESS';
const ROLES_FETCH_ERROR = 'ROLES_FETCH_ERROR';

const ROLES_CREATE_START = 'ROLES_CREATE_START';
const ROLES_CREATE_SUCCESS = 'ROLES_CREATE_SUCCESS';
const ROLES_CREATE_ERROR = 'ROLES_CREATE_ERROR';

export const rolesDataEntry = createAction<RolesLocalState>(ROLES_DATA_ENTRY);

export const rolesFetchStart = createAction(ROLES_FETCH_START);
export const rolesFetchSuccess = createAction<RolesExternalState>(ROLES_FETCH_SUCCESS);
export const rolesFetchError = createAction(ROLES_FETCH_ERROR);

export const rolesCreateStart = createAction<Role>(ROLES_CREATE_START);
export const rolesCreateSuccess = createAction<RolesExternalState>(ROLES_CREATE_SUCCESS);
export const rolesCreateError = createAction(ROLES_CREATE_ERROR);

export const rolesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rolesFetch());
    dispatch(rolesFetchStart());
    return authenticatedFetch(`/users/roles`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(rolesFetchSuccess(d)))
      .catch(e => dispatch(rolesFetchError(e)))
      ;
  }
};

export const rolesCreate = (role: Role) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rolesCreate(role));
    dispatch(rolesCreateStart(role));
    return authenticatedFetch('/users/role', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(role),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(rolesCreateSuccess(d)))
      .catch(e => dispatch(rolesCreateError(e)))
      ;
  }
};

export const rolesInternalReducers = handleActions<RolesLocalState, any>({
  [ROLES_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [ROLES_FETCH_SUCCESS]: (state, action) => {
    return RolesLocalState.default().withEntities(action.payload);
  },
  [ROLES_CREATE_SUCCESS]: (state, action) => {
    return RolesLocalState.default().withEntities(action.payload);
  }
}, RolesLocalState.default());

export const rolesExternalReducers = handleActions<RolesExternalState, any>({
  [ROLES_FETCH_START]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [ROLES_FETCH_SUCCESS]: (state, action) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [ROLES_FETCH_ERROR]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [ROLES_CREATE_START]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [ROLES_CREATE_SUCCESS]: (state, action) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [ROLES_CREATE_ERROR]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

}, new RolesExternalState());