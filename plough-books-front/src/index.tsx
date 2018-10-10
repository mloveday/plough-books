import {createBrowserHistory} from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Router} from 'react-router';
import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {App} from './App/App';
import './index.css';
import {reducers} from "./redux";
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk)
);
const browserHistory = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}/>
        </Router>
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
