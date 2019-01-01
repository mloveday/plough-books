import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {DateFormats} from "../../../Util/DateFormats";
import {weeksDataKey} from "../../../Util/DateUtils";
import {CashUpEntity} from "./CashUpEntity";
import {CashUpExternalState} from "./CashUpExternalState";
import {CashUpsForWeek} from "./CashUpsForWeek";

const CASH_UP_DATA_ENTRY = 'CASH_UP_DATA_ENTRY';

const CASH_UP_FETCH_START = 'CASH_UP_FETCH_START';
const CASH_UP_FETCH_SUCCESS = 'CASH_UP_FETCH_SUCCESS';
const CASH_UP_FETCH_ERROR = 'CASH_UP_FETCH_ERROR';

const CASH_UP_CREATE_START = 'CASH_UP_CREATE_START';
const CASH_UP_CREATE_SUCCESS = 'CASH_UP_CREATE_SUCCESS';
const CASH_UP_CREATE_ERROR = 'CASH_UP_CREATE_ERROR';

export const cashUpDataEntry = createAction<CashUpEntity[]>(CASH_UP_DATA_ENTRY);

export const cashUpFetchStart = createAction<moment.Moment>(CASH_UP_FETCH_START);
export const cashUpFetchSuccess = createAction<{date: moment.Moment, response: CashUpExternalState}>(CASH_UP_FETCH_SUCCESS);
export const cashUpFetchError = createAction(CASH_UP_FETCH_ERROR);

export const cashUpCreateStart = createAction<CashUpEntity>(CASH_UP_CREATE_START);
export const cashUpCreateSuccess = createAction<{date: moment.Moment, response: CashUpExternalState}>(CASH_UP_CREATE_SUCCESS);
export const cashUpCreateError = createAction(CASH_UP_CREATE_ERROR);

export const cashUpFetchWithPrevious = (date: moment.Moment) => {
  return (dispatch: any) => {
    dispatch(cashUpFetch(date.clone().subtract(1, "year")));
    dispatch(cashUpFetch(moment.utc().subtract(4, "weeks")));
    dispatch(cashUpFetch(moment.utc().subtract(3, "weeks")));
    dispatch(cashUpFetch(moment.utc().subtract(2, "weeks")));
    dispatch(cashUpFetch(moment.utc().subtract(1, "weeks")));
    dispatch(cashUpFetch(date));
  }
};

export const cashUpFetch = (date: moment.Moment) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(cashUpFetch(date));
    dispatch(cashUpFetchStart(date));
    return authenticatedFetch(`/cash-up/${date.format(DateFormats.API)}`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(cashUpFetchSuccess({date, response: d})))
      .catch(e => dispatch(cashUpFetchError(e)))
      ;
  }
};

export const cashUpCreate = (cashUp: CashUpEntity) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(cashUpCreate(cashUp));
    dispatch(cashUpCreateStart(cashUp));
    return authenticatedFetch('/cash-up', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(cashUp),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(cashUpCreateSuccess({date: cashUp.date, response: d})))
      .catch(e => dispatch(cashUpCreateError(e)))
      ;
  }
};

export const cashUpInternalReducers = handleActions<CashUpsForWeek, any>({
  [CASH_UP_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [CASH_UP_FETCH_SUCCESS]: (state, action) => {
    return state.with(Array.from(CashUpsForWeek.defaultForWeek(action.payload.date).cashUps.values())).with(action.payload.response);
  },
  [CASH_UP_CREATE_SUCCESS]: (state, action) => {
    return state.with(action.payload.response);
  }
}, CashUpsForWeek.default());

export const cashUpExternalReducers = handleActions<CashUpExternalState, any>({
  [CASH_UP_FETCH_START]: (state, action) => {
    return state.with(state.cashUpsForWeek.with(Array.from(CashUpsForWeek.defaultForWeek(action.payload).cashUps.values())), state.updatedState(FetchStatus.STARTED, weeksDataKey(action.payload)));
  },
  [CASH_UP_FETCH_SUCCESS]: (state, action) => {
    return state.with(state.cashUpsForWeek.with(action.payload.response), state.updatedState(FetchStatus.OK, weeksDataKey(action.payload.date)));
  },
  [CASH_UP_FETCH_ERROR]: (state, action) => {
    return state.with(state.cashUpsForWeek, state.updatedState(FetchStatus.ERROR, weeksDataKey(action.payload)));
  },
  [CASH_UP_CREATE_START]: (state, action) => {
    return state.with(state.cashUpsForWeek.with(action.payload.response), state.updatedState(FetchStatus.STARTED, weeksDataKey(action.payload.date)));
  },
  [CASH_UP_CREATE_SUCCESS]: (state, action) => {
    return state.with(state.cashUpsForWeek.with(action.payload.response), state.updatedState(FetchStatus.OK, weeksDataKey(action.payload.date)));
  },
  [CASH_UP_CREATE_ERROR]: (state, action) => {
    return state.with(state.cashUpsForWeek, state.updatedState(FetchStatus.ERROR, weeksDataKey(action.payload)));
  },

  }, new CashUpExternalState());