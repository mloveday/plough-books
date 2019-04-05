import * as log from "loglevel";
import * as moment from "moment";
import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Common/Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Common/Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {DefinedAction} from "../../../State/DefinedAction";
import {DateFormats} from "../../../Util/DateFormats";
import {weeksDataKey} from "../../../Util/DateUtils";
import {RotaEntity} from "./RotaEntity";
import {RotaExternalState} from "./RotaExternalState";
import {RotasForWeek} from "./RotasForWeek";
import {RotaApiType} from "./RotaTypes";

const ROTA_DATA_ENTRY = 'ROTA_DATA_ENTRY';

const ROTA_FETCH_START = 'ROTA_FETCH_START';
const ROTA_FETCH_SUCCESS = 'ROTA_FETCH_SUCCESS';
const ROTA_FETCH_ERROR = 'ROTA_FETCH_ERROR';

const ROTA_CREATE_START = 'ROTA_CREATE_START';
const ROTA_CREATE_SUCCESS = 'ROTA_CREATE_SUCCESS';
const ROTA_CREATE_ERROR = 'ROTA_CREATE_ERROR';

const WEEKLY_ROTAS_CREATE_START = 'WEEKLY_ROTAS_CREATE_START';
const WEEKLY_ROTAS_CREATE_SUCCESS = 'WEEKLY_ROTAS_CREATE_SUCCESS';
const WEEKLY_ROTAS_CREATE_ERROR = 'WEEKLY_ROTAS_CREATE_ERROR';

interface IWeeklyCreate {date: moment.Moment, response: RotaEntity[]}
interface IFetchResponse {date: moment.Moment, response: RotaApiType[]}
interface IFetchErrorResponse {date: moment.Moment, error: any}

export const rotaDataEntry = createAction<RotaEntity[]>(ROTA_DATA_ENTRY);

export const rotaFetchStart = createAction<moment.Moment>(ROTA_FETCH_START);
export const rotaFetchSuccess = createAction<IFetchResponse>(ROTA_FETCH_SUCCESS);
export const rotaFetchError = createAction<IFetchErrorResponse>(ROTA_FETCH_ERROR);

export const rotaCreateStart = createAction<RotaEntity>(ROTA_CREATE_START);
export const rotaCreateSuccess = createAction<IFetchResponse>(ROTA_CREATE_SUCCESS);
export const rotaCreateError = createAction<IFetchErrorResponse>(ROTA_CREATE_ERROR);

export const weeklyRotasCreateStart = createAction<IWeeklyCreate>(WEEKLY_ROTAS_CREATE_START);
export const weeklyRotasCreateSuccess = createAction<IFetchResponse>(WEEKLY_ROTAS_CREATE_SUCCESS);
export const weeklyRotasCreateError = createAction(WEEKLY_ROTAS_CREATE_ERROR);

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
    return authenticatedFetch(`/rota/${date.format(DateFormats.API)}`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(rotaFetchSuccess({date, response: d})))
      .catch(e => dispatch(rotaFetchError({date, error: e})))
      ;
  }
};

export const rotaCreate = (rota: RotaEntity) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaCreate(rota));
    dispatch(rotaCreateStart(rota));
    return authenticatedFetch('/rota', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(rota.forApi()),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(rotaCreateSuccess({date: rota.getDate(), response: d})))
      .catch(e => dispatch(rotaCreateError({date: rota.getDate(), error: e})))
      ;
  }
};

export const weeklyRotasCreate = (rotas: RotaEntity[]) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(weeklyRotasCreate(rotas));
    dispatch(weeklyRotasCreateStart({date: rotas[0].getDate(), response: rotas}));
    return authenticatedFetch('/weekly-planning', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(rotas.map(rota => rota.forApi())),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(weeklyRotasCreateSuccess({date: Array.from(rotas.values())[0].getDate(), response: d})))
      .catch(e => dispatch(weeklyRotasCreateError({date: Array.from(rotas.values())[0].getDate(), error: e})))
      ;
  }
};

const handleRotaPayload = (state: RotasForWeek, payload: IFetchResponse): RotasForWeek => {
  return state.populateWeekFromApi(moment.utc(payload.date), payload.response);
};

export const rotaInternalReducers = handleActions<RotasForWeek, any>({
  [ROTA_DATA_ENTRY]: (state: RotasForWeek, action) => {
    return state.update(action.payload);
  },
  [ROTA_FETCH_SUCCESS]: (state, action) => {
    return handleRotaPayload(state, action.payload);
  },
  [ROTA_CREATE_SUCCESS]: (state, action) => {
    return handleRotaPayload(state, action.payload);
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action) => {
    return handleRotaPayload(state, action.payload);
  },
}, RotasForWeek.default());

export const rotaExternalReducers = handleActions<RotaExternalState, any>({
  [ROTA_FETCH_START]: (state, action: DefinedAction<moment.Moment>) => {
    return state.withStateChange(state.updatedState(FetchStatus.STARTED, weeksDataKey(moment.utc(action.payload))));
  },
  [ROTA_FETCH_SUCCESS]: (state, action: DefinedAction<IFetchResponse>) => {
    return state.with(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK, weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_FETCH_ERROR]: (state, action: DefinedAction<IFetchErrorResponse>) => {
    log.error(action.payload.error);
    return state.withStateChange(state.updatedState(FetchStatus.ERROR, weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_CREATE_START]: (state, action: DefinedAction<RotaEntity>) => {
    return state.withStateChange(state.updatedState(FetchStatus.STARTED, weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_CREATE_SUCCESS]: (state, action: DefinedAction<IFetchResponse>) => {
    return state.with(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK, weeksDataKey(moment.utc(action.payload.date))));
  },
  [ROTA_CREATE_ERROR]: (state, action: DefinedAction<IFetchErrorResponse>) => {
    log.error(action.payload.error);
    return state.withStateChange(state.updatedState(FetchStatus.ERROR, weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_START]: (state, action: DefinedAction<IWeeklyCreate>) => {
    return state.with(state.rotasForWeek.update(action.payload.response), state.updatedState(FetchStatus.STARTED, weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action: DefinedAction<IFetchResponse>) => {
    return state.with(handleRotaPayload(state.rotasForWeek, action.payload), state.updatedState(FetchStatus.OK, weeksDataKey(moment.utc(action.payload.date))));
  },
  [WEEKLY_ROTAS_CREATE_ERROR]: (state, action: DefinedAction<IFetchErrorResponse>) => {
    log.error(action.payload.error);
    return state.withStateChange(state.updatedState(FetchStatus.ERROR, weeksDataKey(moment.utc(action.payload.date))));
  },

  }, new RotaExternalState());