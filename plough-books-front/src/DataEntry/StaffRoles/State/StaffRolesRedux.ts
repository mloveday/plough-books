import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {StaffRolesExternalState} from "./StaffRolesExternalState";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

const STAFF_ROLES_DATA_ENTRY = 'STAFF_ROLES_DATA_ENTRY';

const STAFF_ROLES_FETCH_START = 'STAFF_ROLES_FETCH_START';
const STAFF_ROLES_FETCH_SUCCESS = 'STAFF_ROLES_FETCH_SUCCESS';
const STAFF_ROLES_FETCH_ERROR = 'STAFF_ROLES_FETCH_ERROR';

const STAFF_ROLES_CREATE_START = 'STAFF_ROLES_CREATE_START';
const STAFF_ROLES_CREATE_SUCCESS = 'STAFF_ROLES_CREATE_SUCCESS';
const STAFF_ROLES_CREATE_ERROR = 'STAFF_ROLES_CREATE_ERROR';

export const staffRolesDataEntry = createAction<StaffRolesLocalState>(STAFF_ROLES_DATA_ENTRY);

export const staffRolesFetchStart = createAction(STAFF_ROLES_FETCH_START);
export const staffRolesFetchSuccess = createAction<StaffRolesExternalState>(STAFF_ROLES_FETCH_SUCCESS);
export const staffRolesFetchError = createAction(STAFF_ROLES_FETCH_ERROR);

export const staffRolesCreateStart = createAction<StaffRolesLocalState>(STAFF_ROLES_CREATE_START);
export const staffRolesCreateSuccess = createAction<StaffRolesExternalState>(STAFF_ROLES_CREATE_SUCCESS);
export const staffRolesCreateError = createAction(STAFF_ROLES_CREATE_ERROR);

export const staffRolesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffRolesFetch());
    dispatch(staffRolesFetchStart());
    return authenticatedFetch(`/staff/roles`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(staffRolesFetchSuccess(d)))
      .catch(e => dispatch(staffRolesFetchError(e)))
      ;
  }
};

// TODO this should not set _all_ members, should be individual staff members
export const staffRolesCreate = (staffRoles: StaffRolesLocalState) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffRolesCreate(staffRoles));
    dispatch(staffRolesCreateStart(staffRoles));
    return authenticatedFetch('/staff/roles', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(staffRoles),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(staffRolesCreateSuccess(d)))
      .catch(e => dispatch(staffRolesCreateError(e)))
      ;
  }
};

export const staffRolesInternalReducers = handleActions<StaffRolesLocalState, any>({
  [STAFF_ROLES_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [STAFF_ROLES_FETCH_SUCCESS]: (state, action) => {
    return StaffRolesLocalState.default().with(action.payload);
  },
  [STAFF_ROLES_CREATE_SUCCESS]: (state, action) => {
    return StaffRolesLocalState.default().with(action.payload);
  }
}, StaffRolesLocalState.default());

export const staffRolesExternalReducers = handleActions<StaffRolesExternalState, any>({
  [STAFF_ROLES_FETCH_START]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.STARTED);
  },
  [STAFF_ROLES_FETCH_SUCCESS]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.OK, StaffRolesLocalState.default().with(action.payload));
  },
  [STAFF_ROLES_FETCH_ERROR]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.ERROR);
  },
  [STAFF_ROLES_CREATE_START]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.STARTED, StaffRolesLocalState.default().with(action.payload));
  },
  [STAFF_ROLES_CREATE_SUCCESS]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.OK, StaffRolesLocalState.default().with(action.payload));
  },
  [STAFF_ROLES_CREATE_ERROR]: (state, action) => {
    return new StaffRolesExternalState(FetchStatus.ERROR);
  },

  }, new StaffRolesExternalState(FetchStatus.EMPTY, StaffRolesLocalState.default()));