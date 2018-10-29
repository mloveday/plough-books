import * as moment from 'moment';
import {createAction, handleActions} from "redux-actions";
import {CashUpState} from "./CashUpState";

const CASH_UP_DATA_ENTRY = 'CASH_UP_DATA_ENTRY';

export const cashUpDataEntry = createAction<CashUpState>(CASH_UP_DATA_ENTRY);

export const cashUpReducers = handleActions<CashUpState, any>({
    [CASH_UP_DATA_ENTRY]: (state, action) => {
      return state.with(action.payload);
    }
  }, CashUpState.default(moment()));