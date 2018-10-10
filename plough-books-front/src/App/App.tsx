import * as React from 'react';
import {Route} from "react-router";
import {Link} from "react-router-dom";
import {CashUp} from "../DataEntry/CashUp/CashUp";
import {Rota} from "../DataEntry/Rota/Rota";
import {SignIn} from "../DataEntry/SignIn/SignIn";
import {WeeklyOverview} from "../DataVisualisation/WeeklyOverview/WeeklyOverview";
import './App.css';

export class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Plough Books</h1>
        </header>
        <nav className="App-nav">
          <ul className="App-nav-list">
            <li className="App-nav-item"><Link to="/cash-up">Cash up</Link></li>
            <li className="App-nav-item"><Link to="/rota">Rota</Link></li>
            <li className="App-nav-item"><Link to="/sign-in-sheet">Sign-in sheet</Link></li>
            <li className="App-nav-item"><Link to="/weekly-overview">Weekly overview</Link></li>
          </ul>
        </nav>
        <div className="App-content-container">
            <Route path="/cash-up" component={CashUp}/>
            <Route path="/rota" component={Rota}/>
            <Route path="/sign-in-sheet" component={SignIn}/>
            <Route path="/weekly-overview" component={WeeklyOverview}/>
        </div>
      </div>
    );
  }
}
