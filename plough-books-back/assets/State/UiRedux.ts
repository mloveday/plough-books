import {createAction, handleActions} from "redux-actions";
import {UiState} from "./UiState";

const UI_UPDATE = 'UI_UPDATE';

export const uiUpdate = createAction<UiState>(UI_UPDATE);

export const uiReducers = handleActions<UiState, any>({
  [UI_UPDATE]: (state, action) => {
    return action.payload;
  },
}, UiState.default());