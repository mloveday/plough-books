import * as React from 'react';
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
        <div><CashUp/></div>
        <div><Rota/></div>
        <div><SignIn/></div>
        <div><WeeklyOverview/></div>
      </div>
    );
  }
}
