import * as moment from "moment";
import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaApiType} from "../../Model/Rota/RotaTypes";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDate, weeksDataKey} from "../../Util/DateUtils";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {RotaExternalState} from "./RotaExternalState";

const ROTA_DATA_ENTRY = 'ROTA_DATA_ENTRY';

const ROTA_FETCH_START = 'ROTA_FETCH_START';
const ROTA_FETCH_SUCCESS = 'ROTA_FETCH_SUCCESS';
export const ROTA_FETCH_ERROR = 'ROTA_FETCH_ERROR';

const ROTA_CREATE_START = 'ROTA_CREATE_START';
const ROTA_CREATE_SUCCESS = 'ROTA_CREATE_SUCCESS';
export const ROTA_CREATE_ERROR = 'ROTA_CREATE_ERROR';

const WEEKLY_ROTAS_CREATE_START = 'WEEKLY_ROTAS_CREATE_START';
const WEEKLY_ROTAS_CREATE_SUCCESS = 'WEEKLY_ROTAS_CREATE_SUCCESS';
export const WEEKLY_ROTAS_CREATE_ERROR = 'WEEKLY_ROTAS_CREATE_ERROR';

interface WeeklyCreatePayload {date: moment.Moment, response: RotaEntity[]}
interface FetchResponsePayload {date: moment.Moment, response: RotaApiType[]}
interface FetchErrorPayload extends ErrorPayload {date: moment.Moment}

export const rotaDataEntry = createAction<RotaEntity[]>(ROTA_DATA_ENTRY);

export const rotaFetchStart = createAction<moment.Moment>(ROTA_FETCH_START);
export const rotaFetchSuccess = createAction<FetchResponsePayload>(ROTA_FETCH_SUCCESS);
export const rotaFetchError = createAction<FetchErrorPayload>(ROTA_FETCH_ERROR);

export const rotaCreateStart = createAction<RotaEntity>(ROTA_CREATE_START);
export const rotaCreateSuccess = createAction<FetchResponsePayload>(ROTA_CREATE_SUCCESS);
export const rotaCreateError = createAction<FetchErrorPayload>(ROTA_CREATE_ERROR);

export const weeklyRotasCreateStart = createAction<WeeklyCreatePayload>(WEEKLY_ROTAS_CREATE_START);
export const weeklyRotasCreateSuccess = createAction<FetchResponsePayload>(WEEKLY_ROTAS_CREATE_SUCCESS);
export const weeklyRotasCreateError = createAction<FetchErrorPayload>(WEEKLY_ROTAS_CREATE_ERROR);

export const rotaFetchWithPrevious = (date: moment.Moment) => {
  return (dispatch: any) => {
    dispatch(rotaFetch(date.clone().subtract(1, "year")));
    dispatch(rotaFetch(moment.utc().subtract(4, "weeks")));
    dispatch(rotaFetch(moment.utc().subtract(3, "weeks")));
    dispatch(rotaFetch(moment.utc().subtract(2, "weeks")));
    dispatch(rotaFetch(moment.utc().subtract(1, "weeks")));
    dispatch(rotaFetch(date));
  }
};

export const rotaFetch = (date: moment.Moment) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaFetch(date));
    dispatch(rotaFetchStart(date));
    return authenticatedFetch(`/rota/${date.format(DateFormats.API_DATE)}`, () => dispatch(invalidUser([thisDispatchable])))
    // TODO parse the data here into models before dispatching action
      .then(d => dispatch(rotaFetchSuccess({date, response: d})))
      .catch(e => dispatch(rotaFetchError({date, error: e, appArea: 'Rota fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const rotaCreate = (rota: RotaEntity) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaCreate(rota));
    dispatch(rotaCreateStart(rota));
    return authenticatedFetch('/rota', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(rota.forApi()),'POST')
    // TODO parse the data here into models before dispatching action
      .then(d => dispatch(rotaCreateSuccess({date: rota.getDate(), response: d})))
      .catch(e => dispatch(rotaCreateError({date: rota.getDate(), appArea: 'Rota post', error: e, dispatch: thisDispatchable})))
      ;
  }
};

export const weeklyRotasCreate = (rotas: RotaEntity[]) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(weeklyRotasCreate(rotas));
    dispatch(weeklyRotasCreateStart({date: rotas[0].getDate(), response: rotas}));
    return authenticatedFetch('/weekly-planning', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(rotas.map(rota => rota.forApi())),'POST')
    // TODO parse the data here into models before dispatching action
      .then(d => dispatch(weeklyRotasCreateSuccess({date: Array.from(rotas.values())[0].getDate(), response: d})))
      .catch(e => dispatch(weeklyRotasCreateError({date: Array.from(rotas.values())[0].getDate(), error: e, appArea: 'Weekly Rotas post', dispatch: thisDispatchable})))
      ;
  }
};

const handleRotaPayload = (state: RotasForWeek, payload: FetchResponsePayload): RotasForWeek => {
  return state.populateWeekFromApi(moment.utc(payload.date), payload.response);
};

export const rotaInternalReducers = handleActions<RotasForWeek, any>({
  [ROTA_DATA_ENTRY]: (state: RotasForWeek, action: DefinedAction<any>) => {
    return state.update(action.payload);
  },
  [ROTA_FETCH_SUCCESS]: (state, action: DefinedAction<any>) => {
    return handleRotaPayload(state, action.payload);
  },
  [ROTA_CREATE_SUCCESS]: (state, action: DefinedAction<any>) => {
    return handleRotaPayload(state, action.payload);
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action: DefinedAction<any>) => {
    return handleRotaPayload(state, action.payload);
  },
}, RotasForWeek.default());

export const rotaExternalReducers = handleActions<RotaExternalState, any>({
  [ROTA_FETCH_START]: (state, action: DefinedAction<moment.Moment>) => {
    return state.withStateChange(state.updatedState(FetchStatus.STARTED,
                                                    'get',
                                                    weeksDataKey(moment.utc(action.payload))));
  },
  [ROTA_FETCH_SUCCESS]: (state, action: DefinedAction<FetchResponsePayload>) => {
    return new RotaExternalState(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK,
                                                                                                           'get',
                                                                                                           weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_FETCH_ERROR]: (state, action: DefinedAction<FetchErrorPayload>) => {
    return state.withStateChange(state.updatedState(FetchStatus.ERROR,
                                                    'get',
                                                    weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_CREATE_START]: (state, action: DefinedAction<RotaEntity>) => {
    return state.withStateChange(state.updatedState(FetchStatus.STARTED,
                                                    'post',
                                                    weeksDataKey(momentFromDate(action.payload.date))));
  },
  [ROTA_CREATE_SUCCESS]: (state, action: DefinedAction<FetchResponsePayload>) => {
    return new RotaExternalState(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK,
                                                                                                           'post',
                                                                                                           weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_CREATE_ERROR]: (state, action: DefinedAction<FetchErrorPayload>) => {
    return state.withStateChange(state.updatedState(FetchStatus.ERROR,
                                                    'post',
                                                    weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_START]: (state, action: DefinedAction<WeeklyCreatePayload>) => {
    return new RotaExternalState(state.rotasForWeek.update(action.payload.response), state.updatedState(FetchStatus.STARTED,
                                                                                                        'post',
                                                                                                        weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action: DefinedAction<FetchResponsePayload>) => {
    return new RotaExternalState(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK,
                                                                                                           'post',
                                                                                                           weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_ERROR]: (state, action: DefinedAction<FetchErrorPayload>) => {
    return state.withStateChange(state.updatedState(FetchStatus.ERROR,
                                                    'post',
                                                    weeksDataKey(moment.utc(action.payload.date))));
  },

  }, new RotaExternalState());