import {createBrowserHistory} from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Router} from 'react-router';
import {applyMiddleware, combineReducers, createStore} from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {App} from './App/App';
import './index.scss';
import {reducers} from "./redux";

const store = createStore(
  combineReducers(reducers),
  composeWithDevTools(applyMiddleware(thunk))
);
const browserHistory = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
          <Route component={App}/>
        </Router>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
