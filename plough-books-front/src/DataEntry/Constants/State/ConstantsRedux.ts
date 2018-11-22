import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {ConstantsExternalState} from "./ConstantsExternalState";
import {ConstantsLocalState} from "./ConstantsLocalState";

const CONSTANTS_DATA_ENTRY = 'CONSTANTS_DATA_ENTRY';

const CONSTANTS_FETCH_START = 'CONSTANTS_FETCH_START';
const CONSTANTS_FETCH_SUCCESS = 'CONSTANTS_FETCH_SUCCESS';
const CONSTANTS_FETCH_ERROR = 'CONSTANTS_FETCH_ERROR';

const CONSTANTS_CREATE_START = 'CONSTANTS_CREATE_START';
const CONSTANTS_CREATE_SUCCESS = 'CONSTANTS_CREATE_SUCCESS';
const CONSTANTS_CREATE_ERROR = 'CONSTANTS_CREATE_ERROR';

export const constantsDataEntry = createAction<ConstantsLocalState>(CONSTANTS_DATA_ENTRY);

export const constantsFetchStart = createAction(CONSTANTS_FETCH_START);
export const constantsFetchSuccess = createAction<ConstantsExternalState>(CONSTANTS_FETCH_SUCCESS);
export const constantsFetchError = createAction(CONSTANTS_FETCH_ERROR);

export const constantsCreateStart = createAction<ConstantsLocalState>(CONSTANTS_CREATE_START);
export const constantsCreateSuccess = createAction<ConstantsExternalState>(CONSTANTS_CREATE_SUCCESS);
export const constantsCreateError = createAction(CONSTANTS_CREATE_ERROR);

export const constantsFetch = () => {
  return (dispatch: any) => {
    dispatch(constantsFetchStart());
    return authenticatedFetch(`/constants`, () => dispatch(invalidUser()))
      .then(d => dispatch(constantsFetchSuccess(d)))
      .catch(e => dispatch(constantsFetchError(e)))
      ;
  }
};

export const constantsCreate = (constants: ConstantsLocalState) => {
  return (dispatch: any) => {
    dispatch(constantsCreateStart(constants));
    return authenticatedFetch('/constants', () => dispatch(invalidUser()), {
      body: JSON.stringify(constants),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(constantsCreateSuccess(d)))
      .catch(e => dispatch(constantsCreateError(e)))
      ;
  }
};

export const constantsInternalReducers = handleActions<ConstantsLocalState, any>({
  [CONSTANTS_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [CONSTANTS_FETCH_SUCCESS]: (state, action) => {
    return ConstantsLocalState.default().with(action.payload);
  },
  [CONSTANTS_CREATE_SUCCESS]: (state, action) => {
    return ConstantsLocalState.default().with(action.payload);
  }
}, ConstantsLocalState.default());

export const constantsExternalReducers = handleActions<ConstantsExternalState, any>({
  [CONSTANTS_FETCH_START]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.STARTED);
  },
  [CONSTANTS_FETCH_SUCCESS]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.OK, ConstantsLocalState.default().with(action.payload));
  },
  [CONSTANTS_FETCH_ERROR]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.ERROR);
  },
  [CONSTANTS_CREATE_START]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.STARTED, ConstantsLocalState.default().with(action.payload));
  },
  [CONSTANTS_CREATE_SUCCESS]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.OK, ConstantsLocalState.default().with(action.payload));
  },
  [CONSTANTS_CREATE_ERROR]: (state, action) => {
    return new ConstantsExternalState(FetchStatus.ERROR);
  },

  }, new ConstantsExternalState(FetchStatus.EMPTY, ConstantsLocalState.default()));