import reduxCrud from 'redux-crud';
import {authReducer} from "./Auth/State/AuthReducer";
import {AuthState} from "./Auth/State/AuthState";
import {CashUpState} from "./DataEntry/CashUp/State/CashUpState";
import {cashUpReducers} from "./DataEntry/CashUp/State/Redux";

const testIdentifier = 'test';
const testSyncActionCreators = reduxCrud.actionCreatorsFor(testIdentifier);
const testAsyncActionCreators = {
  fetchStart() {
    return (dispatch: any) => {
      return fetch('http://localhost:8000/')
        .then(r => r.text())
        .then(d => {dispatch(testSyncActionCreators.fetchSuccess([{status: 'OK', data: JSON.stringify(d), id: 1}]));})
        .catch(e => {dispatch(testSyncActionCreators.fetchError(e, {status: 'NOPE'}));})
        ;
    }
  }
};
export const testActionCreators = Object.assign(testSyncActionCreators,testAsyncActionCreators);

function testReducers(state = [], action: any) {
  switch(action.type) {
    case 'TEST_FETCH_ERROR':
      return [action.data];
    default:
      return reduxCrud.Map.reducersFor(testIdentifier)(state, action);
  }
}

export interface AppState {
  authState: AuthState;
  cashUpState: CashUpState;
  test: any;
}

export const reducers = {
  authState: authReducer,
  cashUpState: cashUpReducers,
  test: testReducers,
};