import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {FetchStatus} from "../../../Enum/FetchStatus";
import {DateFormats} from "../../../Util/DateFormats";
import {RotaEntity} from "./RotaEntity";
import {RotaExternalState} from "./RotaExternalState";
import {RotasForWeek} from "./RotasForWeek";

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

export const rotaDataEntry = createAction<RotaEntity[]>(ROTA_DATA_ENTRY);

export const rotaFetchStart = createAction<moment.Moment>(ROTA_FETCH_START);
export const rotaFetchSuccess = createAction<{date: moment.Moment, response: RotaExternalState}>(ROTA_FETCH_SUCCESS);
export const rotaFetchError = createAction(ROTA_FETCH_ERROR);

export const rotaCreateStart = createAction<RotaEntity>(ROTA_CREATE_START);
export const rotaCreateSuccess = createAction<{date: moment.Moment, response: RotaExternalState}>(ROTA_CREATE_SUCCESS);
export const rotaCreateError = createAction(ROTA_CREATE_ERROR);

export const weeklyRotasCreateStart = createAction<{date: moment.Moment, response: RotaEntity[]}>(WEEKLY_ROTAS_CREATE_START);
export const weeklyRotasCreateSuccess = createAction<{date: moment.Moment, response: RotaExternalState}>(WEEKLY_ROTAS_CREATE_SUCCESS);
export const weeklyRotasCreateError = createAction(WEEKLY_ROTAS_CREATE_ERROR);

export const rotaFetch = (date: moment.Moment) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaFetch(date));
    dispatch(rotaFetchStart(date));
    return authenticatedFetch(`/rota/${date.format(DateFormats.API)}`, () => dispatch(invalidUser([thisDispatchable])))
      .then(d => dispatch(rotaFetchSuccess({date, response: d})))
      .catch(e => dispatch(rotaFetchError(e)))
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
      .then(d => dispatch(rotaCreateSuccess({date: rota.date, response: d})))
      .catch(e => dispatch(rotaCreateError(e)))
      ;
  }
};

export const weeklyRotasCreate = (rotas: RotaEntity[]) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(weeklyRotasCreate(rotas));
    dispatch(weeklyRotasCreateStart({date: rotas[0].date, response: rotas}));
    return authenticatedFetch('/weekly-planning', () => dispatch(invalidUser([thisDispatchable])), {
      body: JSON.stringify(rotas.map(rota => rota.forApi())),
      headers: {
        ['content-type']: 'application/json',
      },
      method: 'POST',
    })
      .then(d => dispatch(weeklyRotasCreateSuccess({date: Array.from(rotas.values())[0].date, response: d})))
      .catch(e => dispatch(weeklyRotasCreateError(e)))
      ;
  }
};

const handleRotaPayload = (payload: {date: moment.Moment, response: any}): RotasForWeek => {
  return RotasForWeek.defaultForWeek(moment(payload.date)).with(payload.response);
};

export const rotaInternalReducers = handleActions<RotasForWeek, any>({
  [ROTA_DATA_ENTRY]: (state: RotasForWeek, action) => {
    return state.with(action.payload);
  },
  [ROTA_FETCH_SUCCESS]: (state, action) => {
    return handleRotaPayload(action.payload);
  },
  [ROTA_CREATE_SUCCESS]: (state, action) => {
    return handleRotaPayload(action.payload);
  },
  [WEEKLY_ROTAS_CREATE_START]: (state: RotasForWeek, action) => {
    return handleRotaPayload(action.payload);
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action) => {
    return handleRotaPayload(action.payload);
  },
}, RotasForWeek.default());

export const rotaExternalReducers = handleActions<RotaExternalState, any>({
  [ROTA_FETCH_START]: (state, action) => {
    return new RotaExternalState(FetchStatus.STARTED);
  },
  [ROTA_FETCH_SUCCESS]: (state, action) => {
    return new RotaExternalState(FetchStatus.OK, handleRotaPayload(action.payload));
  },
  [ROTA_FETCH_ERROR]: (state, action) => {
    return new RotaExternalState(FetchStatus.ERROR);
  },
  [ROTA_CREATE_START]: (state, action) => {
    return new RotaExternalState(FetchStatus.STARTED, handleRotaPayload(action.payload));
  },
  [ROTA_CREATE_SUCCESS]: (state, action) => {
    return new RotaExternalState(FetchStatus.OK, handleRotaPayload(action.payload));
  },
  [ROTA_CREATE_ERROR]: (state, action) => {
    return new RotaExternalState(FetchStatus.ERROR);
  },
  [WEEKLY_ROTAS_CREATE_START]: (state, action) => {
    return new RotaExternalState(FetchStatus.STARTED, handleRotaPayload(action.payload));
  },
  [WEEKLY_ROTAS_CREATE_SUCCESS]: (state, action) => {
    return new RotaExternalState(FetchStatus.OK, handleRotaPayload(action.payload));
  },
  [WEEKLY_ROTAS_CREATE_ERROR]: (state, action) => {
    return new RotaExternalState(FetchStatus.ERROR);
  },

  }, new RotaExternalState(FetchStatus.EMPTY, RotasForWeek.default()));