import {Action} from "redux-actions";

export interface DefinedAction<Payload> extends Action<Payload> {
  payload: Payload;
}