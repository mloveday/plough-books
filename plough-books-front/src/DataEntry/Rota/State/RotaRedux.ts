import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {authenticatedFetch} from "../../../Auth/Repo/AuthenticatedFetch";
import {invalidUser} from "../../../Auth/State/AuthActions";
import {RotaExternalState} from "./RotaExternalState";
import {RotaLocalState} from "./RotaLocalState";
import {RotaLocalStates} from "./RotaLocalStates";

const ROTA_DATA_ENTRY = 'ROTA_DATA_ENTRY';

const ROTA_FETCH_START = 'ROTA_FETCH_START';
const ROTA_FETCH_SUCCESS = 'ROTA_FETCH_SUCCESS';
const ROTA_FETCH_ERROR = 'ROTA_FETCH_ERROR';

const ROTA_CREATE_START = 'ROTA_CREATE_START';
const ROTA_CREATE_SUCCESS = 'ROTA_CREATE_SUCCESS';
const ROTA_CREATE_ERROR = 'ROTA_CREATE_ERROR';

export const rotaDataEntry = createAction<RotaLocalState[]>(ROTA_DATA_ENTRY);

export const rotaFetchStart = createAction<moment.Moment>(ROTA_FETCH_START);
export const rotaFetchSuccess = createAction<{date: moment.Moment, response: RotaExternalState}>(ROTA_FETCH_SUCCESS);
export const rotaFetchError = createAction(ROTA_FETCH_ERROR);

export const rotaCreateStart = createAction<RotaLocalState>(ROTA_CREATE_START);
export const rotaCreateSuccess = createAction<{date: moment.Moment, response: RotaExternalState}>(ROTA_CREATE_SUCCESS);
export const rotaCreateError = createAction(ROTA_CREATE_ERROR);

export const rotaFetch = (date: moment.Moment) => {
  return (dispatch: any) => {
    dispatch(rotaFetchStart(date));
    return authenticatedFetch(`/rota/${date.format('Y-MM-DD')}`, () => dispatch(invalidUser()))
      .then(d => dispatch(rotaFetchSuccess({date, response: d})))
      .catch(e => dispatch(rotaFetchError(e)))
      ;
  }
};

export const rotaCreate = (rota: RotaLocalState) => {
  return (dispatch: any) => {
    dispatch(rotaCreateStart(rota));
    return authenticatedFetch('/rota', () => dispatch(invalidUser()), {
      body: JSON.stringify(rota),
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

export const rotaInternalReducers = handleActions<RotaLocalStates, any>({
  [ROTA_DATA_ENTRY]: (state, action) => {
    return state.with(action.payload);
  },
  [ROTA_FETCH_SUCCESS]: (state, action) => {
    return RotaLocalStates.defaultForWeek(action.payload.date).with(action.payload.response);
  },
  [ROTA_CREATE_SUCCESS]: (state, action) => {
    return RotaLocalStates.defaultForWeek(action.payload.date).with(action.payload.response);
  }
}, RotaLocalStates.default());

export const rotaExternalReducers = handleActions<RotaExternalState, any>({
  [ROTA_FETCH_START]: (state, action) => {
    return new RotaExternalState('START');
  },
  [ROTA_FETCH_SUCCESS]: (state, action) => {
    return new RotaExternalState('OK', RotaLocalStates.defaultForWeek(moment(action.payload.date)).with(action.payload.response));
  },
  [ROTA_FETCH_ERROR]: (state, action) => {
    return new RotaExternalState('ERROR');
  },
  [ROTA_CREATE_START]: (state, action) => {
    return new RotaExternalState('START', RotaLocalStates.defaultForWeek(moment(action.payload.date)).with(action.payload.response));
  },
  [ROTA_CREATE_SUCCESS]: (state, action) => {
    return new RotaExternalState('OK', RotaLocalStates.defaultForWeek(moment(action.payload.date)).with(action.payload.response));
  },
  [ROTA_CREATE_ERROR]: (state, action) => {
    return new RotaExternalState('ERROR');
  },

  }, new RotaExternalState('EMPTY', RotaLocalStates.default()));