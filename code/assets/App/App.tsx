import * as React from "react";
import {connect} from "react-redux";
import {Route} from "react-router";
import {ContentRouting} from "../Common/ContentRouting/ContentRouting";
import {Header} from "../Common/Header/Header";
import {Nav} from "../Common/Nav/Nav";
import {UnauthorisedUserOverlay} from "../Common/Overlay/UnauthorisedUserOverlay";
import {AppState} from "../redux";
import {UiState} from "../State/UiState";
import './App.scss';
import './FontawesomeLibrary';

interface AppOwnProps {
}

interface AppStateProps {
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: AppOwnProps): AppStateProps => {
  return {
    uiState: state.uiState,
  }
};

interface AppDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: AppOwnProps): AppDispatchProps => {
  return {};
};

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

class AppComponent extends React.Component<AppProps, {}> {
  public render() {
    return (
      <div className={`App${this.props.uiState.showingNav ? ' show-menu' : ''}`}>
        <UnauthorisedUserOverlay/>
        <Header/>
        <Nav />
        <Route path="/" component={ContentRouting}/>
      </div>
    );
  }
}

export const App = connect<AppStateProps, AppDispatchProps, AppOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);