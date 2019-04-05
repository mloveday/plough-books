import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Common/Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Common/Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {StaffMember} from "../../../Model/StaffMember/StaffMember";
import {StaffMemberFilters} from "./StaffMemberFilters";
import {StaffMembersExternalState} from "./StaffMembersExternalState";
import {StaffMembersLocalState} from "./StaffMembersLocalState";

const STAFF_MEMBERS_DATA_ENTRY = 'STAFF_MEMBERS_DATA_ENTRY';

const STAFF_MEMBERS_FETCH_START = 'STAFF_MEMBERS_FETCH_START';
const STAFF_MEMBERS_FETCH_SUCCESS = 'STAFF_MEMBERS_FETCH_SUCCESS';
const STAFF_MEMBERS_FETCH_ERROR = 'STAFF_MEMBERS_FETCH_ERROR';

const STAFF_MEMBERS_CREATE_START = 'STAFF_MEMBERS_CREATE_START';
const STAFF_MEMBERS_CREATE_SUCCESS = 'STAFF_MEMBERS_CREATE_SUCCESS';
const STAFF_MEMBERS_CREATE_ERROR = 'STAFF_MEMBERS_CREATE_ERROR';

const STAFF_MEMBERS_FILTER = 'STAFF_MEMBERS_FILTER';

export const staffMembersDataEntry = createAction<StaffMembersLocalState>(STAFF_MEMBERS_DATA_ENTRY);

export const staffMembersFetchStart = createAction(STAFF_MEMBERS_FETCH_START);
export const staffMembersFetchSuccess = createAction<StaffMembersExternalState>(STAFF_MEMBERS_FETCH_SUCCESS);
export const staffMembersFetchError = createAction(STAFF_MEMBERS_FETCH_ERROR);

export const staffMembersCreateStart = createAction<StaffMember>(STAFF_MEMBERS_CREATE_START);
export const staffMembersCreateSuccess = createAction<StaffMembersExternalState>(STAFF_MEMBERS_CREATE_SUCCESS);
export const staffMembersCreateError = createAction(STAFF_MEMBERS_CREATE_ERROR);

export const staffMembersFilter = createAction<StaffMemberFilters>(STAFF_MEMBERS_FILTER);

export const staffMembersFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffMembersFetch());
    dispatch(staffMembersFetchStart());
    return authenticatedFetch(`/staff/members`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(staffMembersFetchSuccess(d)))
      .catch(e => dispatch(staffMembersFetchError(e)))
      ;
  }
};

export const staffMembersCreate = (staffMember: StaffMember) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(staffMembersCreate(staffMember));
    dispatch(staffMembersCreateStart(staffMember));
    return authenticatedFetch('/staff/members', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(staffMember),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(staffMembersCreateSuccess(d)))
      .catch(e => dispatch(staffMembersCreateError(e)))
      ;
  }
};

export const staffMembersInternalReducers = handleActions<StaffMembersLocalState, any>({
  [STAFF_MEMBERS_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [STAFF_MEMBERS_FETCH_SUCCESS]: (state, action) => {
    return StaffMembersLocalState.default().withEntities(action.payload);
  },
  [STAFF_MEMBERS_CREATE_SUCCESS]: (state, action) => {
    return StaffMembersLocalState.default().withEntities(action.payload);
  }
}, StaffMembersLocalState.default());

export const staffMembersExternalReducers = handleActions<StaffMembersExternalState, any>({
  [STAFF_MEMBERS_FETCH_START]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [STAFF_MEMBERS_FETCH_SUCCESS]: (state, action) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [STAFF_MEMBERS_FETCH_ERROR]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [STAFF_MEMBERS_CREATE_START]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [STAFF_MEMBERS_CREATE_SUCCESS]: (state, action) => {
    return state.with(state.externalState.withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [STAFF_MEMBERS_CREATE_ERROR]: (state, action) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

  }, new StaffMembersExternalState());

export const staffMemberFiltersReducer = handleActions<StaffMemberFilters, any>({
  [STAFF_MEMBERS_FILTER]: (state, action) => {
    return state.with(action.payload);
  }
}, new StaffMemberFilters());