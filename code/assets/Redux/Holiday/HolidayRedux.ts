import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {Holiday} from "../../Model/Holiday/Holiday";
import {HolidayApiType} from "../../Model/Holiday/HolidayTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {HolidayExternalState} from "./HolidayExternalState";
import {HolidayLocalState} from "./HolidayLocalState";

const HOLIDAY_DATA_ENTRY = 'HOLIDAY_DATA_ENTRY';

const HOLIDAY_FETCH_START = 'HOLIDAY_FETCH_START';
const HOLIDAY_FETCH_SUCCESS = 'HOLIDAY_FETCH_SUCCESS';
export const HOLIDAY_FETCH_ERROR = 'HOLIDAY_FETCH_ERROR';

const HOLIDAY_CREATE_START = 'HOLIDAY_CREATE_START';
const HOLIDAY_CREATE_SUCCESS = 'HOLIDAY_CREATE_SUCCESS';
export const HOLIDAY_CREATE_ERROR = 'HOLIDAY_CREATE_ERROR';

export const holidayDataEntry = createAction<HolidayLocalState>(HOLIDAY_DATA_ENTRY);

export const holidayFetchStart = createAction(HOLIDAY_FETCH_START);
export const holidayFetchSuccess = createAction<Holiday[]>(HOLIDAY_FETCH_SUCCESS);
export const holidayFetchError = createAction<ErrorPayload>(HOLIDAY_FETCH_ERROR);

export const holidayCreateStart = createAction<Holiday>(HOLIDAY_CREATE_START);
export const holidayCreateSuccess = createAction<Holiday[]>(HOLIDAY_CREATE_SUCCESS);
export const holidayCreateError = createAction<ErrorPayload>(HOLIDAY_CREATE_ERROR);

export const holidaysFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(holidaysFetch());
    dispatch(holidayFetchStart());
    return authenticatedFetch(`/holidays`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: HolidayApiType[]) => d.map(obj => Holiday.fromApi(obj)))
      .then(d => dispatch(holidayFetchSuccess(d)))
      .catch(e => dispatch(holidayFetchError({error: e, appArea: 'Holidays fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const holidayCreate = (holiday: Holiday) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(holidayCreate(holiday));
    dispatch(holidayCreateStart(holiday));
    return authenticatedFetch('/holidays', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(holiday),'POST')
      .then((d: HolidayApiType[]) => d.map(obj => Holiday.fromApi(obj)))
      .then(d => dispatch(holidayCreateSuccess(d)))
      .catch(e => dispatch(holidayCreateError({error: e, appArea: 'Holiday post', dispatch: thisDispatchable})))
      ;
  }
};

export const holidayInternalReducers = handleActions<HolidayLocalState, any>({
  [HOLIDAY_DATA_ENTRY]: (state, action: DefinedAction<HolidayLocalState>) => {
    return state.with(action.payload);
  },
  [HOLIDAY_FETCH_SUCCESS]: (state, action: DefinedAction<Holiday[]>) => {
    return HolidayLocalState.default().withEntities(action.payload);
  },
  [HOLIDAY_CREATE_SUCCESS]: (state, action: DefinedAction<Holiday[]>) => {
    return HolidayLocalState.default().withEntities(action.payload);
  }
}, HolidayLocalState.default());

export const holidayExternalReducers = handleActions<HolidayExternalState, any>({
  [HOLIDAY_FETCH_START]: (state, action: DefinedAction<void>) => {
    return new HolidayExternalState(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [HOLIDAY_FETCH_SUCCESS]: (state, action: DefinedAction<Holiday[]>) => {
    return new HolidayExternalState(HolidayLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK));
  },
  [HOLIDAY_FETCH_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new HolidayExternalState(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [HOLIDAY_CREATE_START]: (state, action: DefinedAction<void>) => {
    return new HolidayExternalState(state.externalState, state.updatedState(FetchStatus.STARTED, 'post'));
  },
  [HOLIDAY_CREATE_SUCCESS]: (state, action: DefinedAction<Holiday[]>) => {
    return new HolidayExternalState(HolidayLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK, 'post'));
  },
  [HOLIDAY_CREATE_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new HolidayExternalState(state.externalState, state.updatedState(FetchStatus.ERROR, 'post'));
  },

  }, new HolidayExternalState());