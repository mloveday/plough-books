import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {DateFormats} from "../../../Util/DateFormats";
import {CashUpExternalState} from "./CashUpExternalState";
import {CashUpLocalState} from "./CashUpLocalState";

const CASH_UP_DATA_ENTRY = 'CASH_UP_DATA_ENTRY';

const CASH_UP_FETCH_START = 'CASH_UP_FETCH_START';
const CASH_UP_FETCH_SUCCESS = 'CASH_UP_FETCH_SUCCESS';
const CASH_UP_FETCH_ERROR = 'CASH_UP_FETCH_ERROR';

const CASH_UP_CREATE_START = 'CASH_UP_CREATE_START';
const CASH_UP_CREATE_SUCCESS = 'CASH_UP_CREATE_SUCCESS';
const CASH_UP_CREATE_ERROR = 'CASH_UP_CREATE_ERROR';

export const cashUpDataEntry = createAction<CashUpLocalState>(CASH_UP_DATA_ENTRY);

export const cashUpFetchStart = createAction<moment.Moment>(CASH_UP_FETCH_START);
export const cashUpFetchSuccess = createAction<CashUpExternalState>(CASH_UP_FETCH_SUCCESS);
export const cashUpFetchError = createAction(CASH_UP_FETCH_ERROR);

export const cashUpCreateStart = createAction<CashUpLocalState>(CASH_UP_CREATE_START);
export const cashUpCreateSuccess = createAction<CashUpExternalState>(CASH_UP_CREATE_SUCCESS);
export const cashUpCreateError = createAction(CASH_UP_CREATE_ERROR);

export const cashUpFetch = (date: moment.Moment) => {
  return (dispatch: any) => {
    dispatch(cashUpFetchStart(date));
    return authenticatedFetch(`/cash-up/${date.format(DateFormats.API)}`, () => dispatch(invalidUser()))
      .then(d => dispatch(cashUpFetchSuccess(d)))
      .catch(e => dispatch(cashUpFetchError(e)))
      ;
  }
};

export const cashUpCreate = (cashUp: CashUpLocalState) => {
  return (dispatch: any) => {
    dispatch(cashUpCreateStart(cashUp));
    return authenticatedFetch('/cash-up', () => dispatch(invalidUser()), {
      body: JSON.stringify(cashUp),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(cashUpCreateSuccess(d)))
      .catch(e => dispatch(cashUpCreateError(e)))
      ;
  }
};

export const cashUpInternalReducers = handleActions<CashUpLocalState, any>({
  [CASH_UP_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [CASH_UP_FETCH_SUCCESS]: (state, action) => {
    return CashUpLocalState.fromBackend(action.payload);
  },
  [CASH_UP_CREATE_SUCCESS]: (state, action) => {
    return CashUpLocalState.fromBackend(action.payload);
  }
}, CashUpLocalState.default(moment()));

export const cashUpExternalReducers = handleActions<CashUpExternalState, any>({
  [CASH_UP_FETCH_START]: (state, action) => {
    return new CashUpExternalState(FetchStatus.STARTED);
  },
  [CASH_UP_FETCH_SUCCESS]: (state, action) => {
    return new CashUpExternalState(FetchStatus.OK, CashUpLocalState.fromBackend(action.payload));
  },
  [CASH_UP_FETCH_ERROR]: (state, action) => {
    return new CashUpExternalState(FetchStatus.ERROR);
  },
  [CASH_UP_CREATE_START]: (state, action) => {
    return new CashUpExternalState(FetchStatus.STARTED, CashUpLocalState.fromBackend(action.payload));
  },
  [CASH_UP_CREATE_SUCCESS]: (state, action) => {
    return new CashUpExternalState(FetchStatus.OK, CashUpLocalState.fromBackend(action.payload));
  },
  [CASH_UP_CREATE_ERROR]: (state, action) => {
    return new CashUpExternalState(FetchStatus.ERROR);
  },

  }, new CashUpExternalState(FetchStatus.EMPTY, CashUpLocalState.default(moment())));