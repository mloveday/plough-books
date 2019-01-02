import * as React from 'react';
import {Route} from "react-router";
import {ContentRouting} from "../Common/ContentRouting/ContentRouting";
import {Header} from "../Common/Header/Header";
import {Nav} from "../Common/Nav/Nav";
import {UnauthorisedUserOverlay} from "../Common/Overlay/UnauthorisedUserOverlay";
import './App.scss';
import './FontawesomeLibrary';

export class App extends React.Component<{ match: any }> {
  public render() {
    return (
      <div className="App">
        <UnauthorisedUserOverlay/>
        <Header/>
        <Nav />
        <Route path="/" component={ContentRouting}/>
      </div>
    );
  }
}
