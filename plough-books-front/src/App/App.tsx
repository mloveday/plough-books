import * as React from 'react';
import {Route} from "react-router";
import {ContentRouting} from "../ContentRouting/ContentRouting";
import {Header} from "../Header/Header";
import {Nav} from "../Nav/Nav";
import './App.css';

export class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header/>
        <Nav/>
        <Route path="/" component={ContentRouting}/>
      </div>
    );
  }
}
