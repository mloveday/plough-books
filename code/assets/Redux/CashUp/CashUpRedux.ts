import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {CashUpEntity} from "../../Model/CashUp/CashUpEntity";
import {CashUpEntityApiType} from "../../Model/CashUp/CashUpEntityTypes";
import {CashUpsForWeek} from "../../Model/CashUp/CashUpsForWeek";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate, weeksDataKey} from "../../Util/DateUtils";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {CashUpExternalState} from "./CashUpExternalState";

const CASH_UP_DATA_ENTRY = 'CASH_UP_DATA_ENTRY';

const CASH_UP_FETCH_START = 'CASH_UP_FETCH_START';
const CASH_UP_FETCH_SUCCESS = 'CASH_UP_FETCH_SUCCESS';
export const CASH_UP_FETCH_ERROR = 'CASH_UP_FETCH_ERROR';

const CASH_UP_CREATE_START = 'CASH_UP_CREATE_START';
const CASH_UP_CREATE_SUCCESS = 'CASH_UP_CREATE_SUCCESS';
export const CASH_UP_CREATE_ERROR = 'CASH_UP_CREATE_ERROR';

interface FetchResponsePayload {date: moment.Moment, response: CashUpEntityApiType[]}
interface FetchErrorPayload extends ErrorPayload {date: moment.Moment}

export const cashUpDataEntry = createAction<CashUpEntity[]>(CASH_UP_DATA_ENTRY);

export const cashUpFetchStart = createAction<moment.Moment>(CASH_UP_FETCH_START);
export const cashUpFetchSuccess = createAction<FetchResponsePayload>(CASH_UP_FETCH_SUCCESS);
export const cashUpFetchError = createAction<FetchErrorPayload>(CASH_UP_FETCH_ERROR);

export const cashUpCreateStart = createAction<CashUpEntity>(CASH_UP_CREATE_START);
export const cashUpCreateSuccess = createAction<FetchResponsePayload>(CASH_UP_CREATE_SUCCESS);
export const cashUpCreateError = createAction<FetchErrorPayload>(CASH_UP_CREATE_ERROR);

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
    return authenticatedFetch(`/cash-up/${date.format(DateFormats.API_DATE)}`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(cashUpFetchSuccess({date, response: d})))
      .catch(e => dispatch(cashUpFetchError({error: e, date: date.clone(), appArea: 'Cash Up fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const cashUpRangeFetch = (startDate: moment.Moment, endDate: moment.Moment) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(cashUpRangeFetch(startDate, endDate));
    dispatch(cashUpFetchStart(startDate));
    return authenticatedFetch(`/cash-up/${startDate.format(DateFormats.API_DATE)}/${endDate.format(DateFormats.API_DATE)}`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(cashUpFetchSuccess({date: startDate, response: d})))
      .catch(e => dispatch(cashUpFetchError({error: e, date: startDate.clone(), appArea: 'Cash Up Range fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const cashUpCreate = (cashUp: CashUpEntity) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(cashUpCreate(cashUp));
    dispatch(cashUpCreateStart(cashUp));
    return authenticatedFetch('/cash-up', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(cashUp),'POST')
      .then(d => dispatch(cashUpCreateSuccess({date: momentFromDate(cashUp.date), response: d})))
      .catch(e => dispatch(cashUpCreateError({error: e, date: momentFromDate(cashUp.date), appArea: 'Cash Up post', dispatch: thisDispatchable})))
      ;
  }
};

export const cashUpInternalReducers = handleActions<CashUpsForWeek, any>({
  [CASH_UP_DATA_ENTRY]: (state, action: DefinedAction<CashUpEntity[]>) => {
    return state.update(action.payload);
  },
  [CASH_UP_FETCH_SUCCESS]: (state: CashUpsForWeek, action: DefinedAction<FetchResponsePayload>) => {
    return state.update(CashUpsForWeek.defaultForWeek(action.payload.date).cashUps).fromApi(action.payload.response);
  },
  [CASH_UP_CREATE_SUCCESS]: (state: CashUpsForWeek, action: DefinedAction<FetchResponsePayload>) => {
    return state.fromApi(action.payload.response);
  }
}, CashUpsForWeek.default());

export const cashUpExternalReducers = handleActions<CashUpExternalState, any>({
  [CASH_UP_FETCH_START]: (state, action: DefinedAction<moment.Moment>) => {
    return new CashUpExternalState(state.cashUpsForWeek.update(CashUpsForWeek.defaultForWeek(action.payload).cashUps), state.updatedState(
      FetchStatus.STARTED,
      'get',
      weeksDataKey(action.payload)));
  },
  [CASH_UP_FETCH_SUCCESS]: (state, action: DefinedAction<FetchResponsePayload>) => {
    return new CashUpExternalState(state.cashUpsForWeek.fromApi(action.payload.response), state.updatedState(FetchStatus.OK,
                                                                                                             'get',
                                                                                                             weeksDataKey(action.payload.date)));
  },
  [CASH_UP_FETCH_ERROR]: (state, action: DefinedAction<FetchErrorPayload>) => {
    return new CashUpExternalState(state.cashUpsForWeek, state.updatedState(FetchStatus.ERROR,
                                                                            'get',
                                                                            weeksDataKey(action.payload.date)));
  },
  [CASH_UP_CREATE_START]: (state, action: DefinedAction<CashUpEntity>) => {
    return new CashUpExternalState(state.cashUpsForWeek.update([action.payload]), state.updatedState(FetchStatus.STARTED,
                                                                                                     'post',
                                                                                                     weeksDataKey(momentFromDate(action.payload.date))));
  },
  [CASH_UP_CREATE_SUCCESS]: (state, action: DefinedAction<FetchResponsePayload>) => {
    return new CashUpExternalState(state.cashUpsForWeek.fromApi(action.payload.response), state.updatedState(FetchStatus.OK,
                                                                                                             'post',
                                                                                                             weeksDataKey(action.payload.date)));
  },
  [CASH_UP_CREATE_ERROR]: (state, action: DefinedAction<FetchErrorPayload>) => {
    return new CashUpExternalState(state.cashUpsForWeek, state.updatedState(FetchStatus.ERROR,
                                                                            'post',
                                                                            weeksDataKey(action.payload.date)));
  },

  }, new CashUpExternalState());