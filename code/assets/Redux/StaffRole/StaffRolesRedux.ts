import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {StaffRoleApiType} from "../../Model/StaffRole/StaffRoleTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {StaffRolesExternalState} from "./StaffRolesExternalState";
import {StaffRolesLocalState} from "./StaffRolesLocalState";

const STAFF_ROLES_DATA_ENTRY = 'STAFF_ROLES_DATA_ENTRY';

const STAFF_ROLES_FETCH_START = 'STAFF_ROLES_FETCH_START';
const STAFF_ROLES_FETCH_SUCCESS = 'STAFF_ROLES_FETCH_SUCCESS';
export const STAFF_ROLES_FETCH_ERROR = 'STAFF_ROLES_FETCH_ERROR';

const STAFF_ROLES_CREATE_START = 'STAFF_ROLES_CREATE_START';
const STAFF_ROLES_CREATE_SUCCESS = 'STAFF_ROLES_CREATE_SUCCESS';
export const STAFF_ROLES_CREATE_ERROR = 'STAFF_ROLES_CREATE_ERROR';

export const staffRolesDataEntry = createAction<StaffRolesLocalState>(STAFF_ROLES_DATA_ENTRY);

export const staffRolesFetchStart = createAction(STAFF_ROLES_FETCH_START);
export const staffRolesFetchSuccess = createAction<StaffRole[]>(STAFF_ROLES_FETCH_SUCCESS);
export const staffRolesFetchError = createAction<ErrorPayload>(STAFF_ROLES_FETCH_ERROR);

export const staffRolesCreateStart = createAction<StaffRole>(STAFF_ROLES_CREATE_START);
export const staffRolesCreateSuccess = createAction<StaffRole[]>(STAFF_ROLES_CREATE_SUCCESS);
export const staffRolesCreateError = createAction<ErrorPayload>(STAFF_ROLES_CREATE_ERROR);

export const staffRolesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffRolesFetch());
    dispatch(staffRolesFetchStart());
    return authenticatedFetch(`/staff/roles`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: StaffRoleApiType[]) => d.map(obj => StaffRole.fromApi(obj)))
      .then(d => dispatch(staffRolesFetchSuccess(d)))
      .catch(e => dispatch(staffRolesFetchError({error: e, appArea: 'Staff Roles fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const staffRolesCreate = (staffRole: StaffRole) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffRolesCreate(staffRole));
    dispatch(staffRolesCreateStart(staffRole));
    return authenticatedFetch('/staff/roles', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(staffRole),'POST')
      .then((d: StaffRoleApiType[]) => d.map(obj => StaffRole.fromApi(obj)))
      .then(d => dispatch(staffRolesCreateSuccess(d)))
      .catch(e => dispatch(staffRolesCreateError({error: e, appArea: 'Staff Roles post', dispatch: thisDispatchable})))
      ;
  }
};

export const staffRolesInternalReducers = handleActions<StaffRolesLocalState, any>({
  [STAFF_ROLES_DATA_ENTRY]: (state, action: DefinedAction<any>) => {
    return state.with(action.payload);
  },
  [STAFF_ROLES_FETCH_SUCCESS]: (state, action: DefinedAction<StaffRole[]>) => {
    return StaffRolesLocalState.default().withEntities(action.payload);
  },
  [STAFF_ROLES_CREATE_SUCCESS]: (state, action: DefinedAction<StaffRole[]>) => {
    return StaffRolesLocalState.default().withEntities(action.payload);
  }
}, StaffRolesLocalState.default());

export const staffRolesExternalReducers = handleActions<StaffRolesExternalState, any>({
  [STAFF_ROLES_FETCH_START]: (state, action: DefinedAction<any>) => {
    return new StaffRolesExternalState(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [STAFF_ROLES_FETCH_SUCCESS]: (state, action: DefinedAction<any>) => {
    return new StaffRolesExternalState(StaffRolesLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [STAFF_ROLES_FETCH_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new StaffRolesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [STAFF_ROLES_CREATE_START]: (state, action: DefinedAction<any>) => {
    return new StaffRolesExternalState(state.externalState.withEntities([action.payload]), state.updatedState(FetchStatus.STARTED));
  },
  [STAFF_ROLES_CREATE_SUCCESS]: (state, action: DefinedAction<any>) => {
    return new StaffRolesExternalState(StaffRolesLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [STAFF_ROLES_CREATE_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new StaffRolesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

  }, new StaffRolesExternalState());