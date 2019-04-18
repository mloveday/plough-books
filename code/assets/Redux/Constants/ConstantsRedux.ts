import {createAction, handleActions} from "redux-actions";
import {Constants} from "../../Model/Constants/Constants";
import {ConstantsApiType} from "../../Model/Constants/ConstantsTypes";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {ConstantsExternalState} from "./ConstantsExternalState";
import {ConstantsLocalState} from "./ConstantsLocalState";

const CONSTANTS_DATA_ENTRY = 'CONSTANTS_DATA_ENTRY';

const CONSTANTS_FETCH_START = 'CONSTANTS_FETCH_START';
const CONSTANTS_FETCH_SUCCESS = 'CONSTANTS_FETCH_SUCCESS';
export const CONSTANTS_FETCH_ERROR = 'CONSTANTS_FETCH_ERROR';

const CONSTANTS_CREATE_START = 'CONSTANTS_CREATE_START';
const CONSTANTS_CREATE_SUCCESS = 'CONSTANTS_CREATE_SUCCESS';
export const CONSTANTS_CREATE_ERROR = 'CONSTANTS_CREATE_ERROR';

export const constantsDataEntry = createAction<ConstantsLocalState>(CONSTANTS_DATA_ENTRY);

export const constantsFetchStart = createAction(CONSTANTS_FETCH_START);
export const constantsFetchSuccess = createAction<Constants[]>(CONSTANTS_FETCH_SUCCESS);
export const constantsFetchError = createAction<ErrorPayload>(CONSTANTS_FETCH_ERROR);

export const constantsCreateStart = createAction<Constants>(CONSTANTS_CREATE_START);
export const constantsCreateSuccess = createAction<Constants[]>(CONSTANTS_CREATE_SUCCESS);
export const constantsCreateError = createAction<ErrorPayload>(CONSTANTS_CREATE_ERROR);

export const constantsFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(constantsFetch());
    dispatch(constantsFetchStart());
    return authenticatedFetch(`/constants`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: ConstantsApiType[]) => d.map(obj => Constants.fromApi(obj)))
      .then(d => dispatch(constantsFetchSuccess(d)))
      .catch(e => dispatch(constantsFetchError({error: e, appArea: 'Constants fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const constantsCreate = (constants: Constants) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(constantsCreate(constants));
    dispatch(constantsCreateStart(constants));
    return authenticatedFetch('/constants', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(constants),'POST')
      .then((d: ConstantsApiType[]) => d.map(obj => Constants.fromApi(obj)))
      .then(d => dispatch(constantsCreateSuccess(d)))
      .catch(e => dispatch(constantsCreateError({error: e, appArea: 'Constants post', dispatch: thisDispatchable})))
      ;
  }
};

export const constantsInternalReducers = handleActions<ConstantsLocalState, any>({
  [CONSTANTS_DATA_ENTRY]: (state, action: DefinedAction<ConstantsLocalState>) => {
    return state.with(action.payload);
  },
  [CONSTANTS_FETCH_SUCCESS]: (state, action: DefinedAction<Constants[]>) => {
    return ConstantsLocalState.default().withEntities(action.payload);
  },
  [CONSTANTS_CREATE_SUCCESS]: (state, action: DefinedAction<Constants[]>) => {
    return ConstantsLocalState.default().withEntities(action.payload);
  }
}, ConstantsLocalState.default());

export const constantsExternalReducers = handleActions<ConstantsExternalState, any>({
  [CONSTANTS_FETCH_START]: (state, action: DefinedAction<void>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [CONSTANTS_FETCH_SUCCESS]: (state, action: DefinedAction<Constants[]>) => {
    return state.with(ConstantsLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [CONSTANTS_FETCH_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [CONSTANTS_CREATE_START]: (state, action: DefinedAction<void>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [CONSTANTS_CREATE_SUCCESS]: (state, action: DefinedAction<Constants[]>) => {
    return state.with(ConstantsLocalState.default().withEntities(action.payload), state.updatedState(FetchStatus.OK));
  },
  [CONSTANTS_CREATE_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return state.with(state.externalState, state.updatedState(FetchStatus.ERROR));
  },

  }, new ConstantsExternalState());