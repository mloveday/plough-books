import {configure, mount} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import * as React from "react";
import {ReactElement} from "react";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {AppState, reducers} from '../redux';
import {StateHelpers} from "./StateHelpers";

export function mountComponent<P>(node: ReactElement<P>, initialState: AppState = StateHelpers.blankAppState()) {
  configure({adapter: new Adapter()});
  return mount(<Provider store={createAndPopulateStore(initialState)}>{node}</Provider>);
}

function createAndPopulateStore(initialState: AppState) {
  // @ts-ignore
  return createStore(combineReducers(reducers), {...initialState}, applyMiddleware(thunk));
}