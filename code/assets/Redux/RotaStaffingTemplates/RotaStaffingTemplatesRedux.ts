import {createAction, handleActions} from "redux-actions";
import {FetchStatus} from "../../Model/Enum/FetchStatus";
import {RotaStaffingTemplate} from "../../Model/RotaStaffingTemplate/RotaStaffingTemplate";
import {RotaStaffingTemplateApiType} from "../../Model/RotaStaffingTemplate/RotaStaffingTemplateTypes";
import {invalidUser} from "../Auth/AuthRedux";
import {authenticatedFetch} from "../AuthenticatedFetch";
import {DefinedAction} from "../DefinedAction";
import {ErrorPayload} from "../Error/ErrorRedux";
import {RotaStaffingTemplatesExternalState} from "./RotaStaffingTemplatesExternalState";
import {RotaStaffingTemplatesLocalState} from "./RotaStaffingTemplatesLocalState";

const ROTA_STAFFING_TEMPLATE_DATA_ENTRY = 'ROTA_STAFFING_TEMPLATE_DATA_ENTRY';

const ROTA_STAFFING_TEMPLATE_FETCH_START = 'ROTA_STAFFING_TEMPLATE_FETCH_START';
const ROTA_STAFFING_TEMPLATE_FETCH_SUCCESS = 'ROTA_STAFFING_TEMPLATE_FETCH_SUCCESS';
export const ROTA_STAFFING_TEMPLATE_FETCH_ERROR = 'ROTA_STAFFING_TEMPLATE_FETCH_ERROR';

const ROTA_STAFFING_TEMPLATE_CREATE_START = 'ROTA_STAFFING_TEMPLATE_CREATE_START';
const ROTA_STAFFING_TEMPLATE_CREATE_SUCCESS = 'ROTA_STAFFING_TEMPLATE_CREATE_SUCCESS';
export const ROTA_STAFFING_TEMPLATE_CREATE_ERROR = 'ROTA_STAFFING_TEMPLATE_CREATE_ERROR';

export const rotaStaffingTemplatesDataEntry = createAction<RotaStaffingTemplatesLocalState>(ROTA_STAFFING_TEMPLATE_DATA_ENTRY);

export const rotaStaffingTemplatesFetchStart = createAction(ROTA_STAFFING_TEMPLATE_FETCH_START);
export const rotaStaffingTemplatesFetchSuccess = createAction<RotaStaffingTemplate[]>(ROTA_STAFFING_TEMPLATE_FETCH_SUCCESS);
export const rotaStaffingTemplatesFetchError = createAction<ErrorPayload>(ROTA_STAFFING_TEMPLATE_FETCH_ERROR);

export const rotaStaffingTemplatesCreateStart = createAction<RotaStaffingTemplate>(ROTA_STAFFING_TEMPLATE_CREATE_START);
export const rotaStaffingTemplatesCreateSuccess = createAction<RotaStaffingTemplate[]>(ROTA_STAFFING_TEMPLATE_CREATE_SUCCESS);
export const rotaStaffingTemplatesCreateError = createAction<ErrorPayload>(ROTA_STAFFING_TEMPLATE_CREATE_ERROR);

export const rotaStaffingTemplatesFetch = () => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaStaffingTemplatesFetch());
    dispatch(rotaStaffingTemplatesFetchStart());
    return authenticatedFetch(`/rota-staffing-templates`, () => dispatch(invalidUser([thisDispatchable])))
      .then((d: RotaStaffingTemplateApiType[]) => d.map(obj => RotaStaffingTemplate.fromApi(obj)))
      .then(d => dispatch(rotaStaffingTemplatesFetchSuccess(d)))
      .catch(e => dispatch(rotaStaffingTemplatesFetchError({error: e, appArea: 'RotaStaffingTemplates fetch', dispatch: thisDispatchable})))
      ;
  }
};

export const rotaStaffingTemplatesCreate = (rotaStaffingTemplates: RotaStaffingTemplate) => {
  return (dispatch: any) => {
    const thisDispatchable = () => dispatch(rotaStaffingTemplatesCreate(rotaStaffingTemplates));
    dispatch(rotaStaffingTemplatesCreateStart(rotaStaffingTemplates));
    return authenticatedFetch('/rota-staffing-templates', () => dispatch(invalidUser([thisDispatchable])), JSON.stringify(rotaStaffingTemplates),'POST')
      .then((d: RotaStaffingTemplateApiType[]) => d.map(obj => RotaStaffingTemplate.fromApi(obj)))
      .then(d => dispatch(rotaStaffingTemplatesCreateSuccess(d)))
      .catch(e => dispatch(rotaStaffingTemplatesCreateError({error: e, appArea: 'RotaStaffingTemplates post', dispatch: thisDispatchable})))
      ;
  }
};

export const rotaStaffingTemplatesInternalReducers = handleActions<RotaStaffingTemplatesLocalState, any>({
  [ROTA_STAFFING_TEMPLATE_DATA_ENTRY]: (state, action: DefinedAction<RotaStaffingTemplatesLocalState>) => {
    return state.with(action.payload);
  },
  [ROTA_STAFFING_TEMPLATE_FETCH_SUCCESS]: (state, action: DefinedAction<RotaStaffingTemplate[]>) => {
    return RotaStaffingTemplatesLocalState.default().withEntities(action.payload);
  },
  [ROTA_STAFFING_TEMPLATE_CREATE_SUCCESS]: (state, action: DefinedAction<RotaStaffingTemplate[]>) => {
    return RotaStaffingTemplatesLocalState.default().withEntities(action.payload);
  }
}, RotaStaffingTemplatesLocalState.default());

export const rotaStaffingTemplatesExternalReducers = handleActions<RotaStaffingTemplatesExternalState, any>({
  [ROTA_STAFFING_TEMPLATE_FETCH_START]: (state, action: DefinedAction<void>) => {
    return new RotaStaffingTemplatesExternalState(state.externalState, state.updatedState(FetchStatus.STARTED));
  },
  [ROTA_STAFFING_TEMPLATE_FETCH_SUCCESS]: (state, action: DefinedAction<RotaStaffingTemplate[]>) => {
    return new RotaStaffingTemplatesExternalState(RotaStaffingTemplatesLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK));
  },
  [ROTA_STAFFING_TEMPLATE_FETCH_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new RotaStaffingTemplatesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR));
  },
  [ROTA_STAFFING_TEMPLATE_CREATE_START]: (state, action: DefinedAction<void>) => {
    return new RotaStaffingTemplatesExternalState(state.externalState, state.updatedState(FetchStatus.STARTED, 'post'));
  },
  [ROTA_STAFFING_TEMPLATE_CREATE_SUCCESS]: (state, action: DefinedAction<RotaStaffingTemplate[]>) => {
    return new RotaStaffingTemplatesExternalState(RotaStaffingTemplatesLocalState.default().withEntities(action.payload), state.updatedState(
      FetchStatus.OK, 'post'));
  },
  [ROTA_STAFFING_TEMPLATE_CREATE_ERROR]: (state, action: DefinedAction<ErrorPayload>) => {
    return new RotaStaffingTemplatesExternalState(state.externalState, state.updatedState(FetchStatus.ERROR, 'post'));
  },

  }, new RotaStaffingTemplatesExternalState());