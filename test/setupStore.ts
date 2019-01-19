import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {AppState, reducers} from '../assets/redux';

export function setupStore(initialState: AppState) {
  // @ts-ignore
  return createStore(combineReducers(reducers), {...initialState}, applyMiddleware(thunk));
}