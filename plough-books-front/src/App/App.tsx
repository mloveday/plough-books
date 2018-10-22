import * as React from 'react';
import {Route} from "react-router";
import {CashUp} from "../DataEntry/CashUp/CashUp";
import {Rota} from "../DataEntry/Rota/Rota";
import {SignIn} from "../DataEntry/SignIn/SignIn";
import {WeeklyOverview} from "../DataVisualisation/WeeklyOverview/WeeklyOverview";
import {Header} from "../Header/Header";
import {Nav} from "../Nav/Nav";
import './App.css';
import {Test} from "./TestComponent";

export class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header/>
        <Nav/>
        <div className="App-content-container">
            <Route path="/cash-up" component={CashUp}/>
            <Route path="/rota" component={Rota}/>
            <Route path="/sign-in-sheet" component={SignIn}/>
            <Route path="/weekly-overview" component={WeeklyOverview}/>
            <Route path="/test" component={Test}/>
        </div>
      </div>
    );
  }
}
