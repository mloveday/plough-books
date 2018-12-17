import {createBrowserHistory} from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Router} from 'react-router';
import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {App} from './App/App';
import './index.scss';
import {reducers} from "./redux";
import {Routes} from "./Routing/Routes";

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, logger)
);
const browserHistory = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
          <Route path={Routes.DATE_FINDER} exact={false} component={App}/>
        </Router>
    </Provider>,
  document.getElementById('root') as HTMLElement
);