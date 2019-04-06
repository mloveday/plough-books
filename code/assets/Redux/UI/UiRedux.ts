import {createAction, handleActions} from "redux-actions";
import {DefinedAction} from "../DefinedAction";
import {UiState} from "./UiState";

const UI_UPDATE = 'UI_UPDATE';

export const uiUpdate = createAction<UiState>(UI_UPDATE);

export const uiReducers = handleActions<UiState, any>({
  [UI_UPDATE]: (state, action: DefinedAction<any>) => {
    return action.payload;
  },
}, UiState.default());