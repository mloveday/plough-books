import {configure, mount} from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import {createBrowserHistory} from "history";
import * as React from "react";
import {ReactElement} from "react";
import {Provider} from "react-redux";
import {Router} from "react-router";
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {AppState, reducers} from '../redux';
import {StateHelpers} from "./StateHelpers";

export function mountComponent<P>(node: ReactElement<P>, initialState: AppState = StateHelpers.blankAppState()) {
  configure({adapter: new Adapter()});
  return mount(<Provider store={createAndPopulateStore(initialState)}><Router history={createBrowserHistory()}>{node}</Router></Provider>);
}

function createAndPopulateStore(initialState: AppState) {
  // @ts-ignore
  return createStore(combineReducers(reducers), {...initialState}, applyMiddleware(thunk));
}