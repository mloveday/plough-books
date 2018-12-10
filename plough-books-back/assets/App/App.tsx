import * as React from 'react';
import {Route} from "react-router";
import {ContentRouting} from "../ContentRouting/ContentRouting";
import {Header} from "../Header/Header";
import {Nav} from "../Nav/Nav";
import {UnauthorisedUserOverlay} from "../Overlay/UnauthorisedUserOverlay";
import './App.scss';

export class App extends React.Component<{ match: any }> {
  public render() {
    return (
      <div className="App">
        <UnauthorisedUserOverlay/>
        <Header/>
        <Nav match={this.props.match}/>
        <Route path="/" component={ContentRouting}/>
      </div>
    );
  }
}
