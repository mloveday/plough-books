import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router";
import {Test} from "../App/TestComponent";
import {CashUp} from "../DataEntry/CashUp/CashUp";
import {Rota} from "../DataEntry/Rota/Rota";
import {SignIn} from "../DataEntry/SignIn/SignIn";
import {WeeklyOverview} from "../DataVisualisation/WeeklyOverview/WeeklyOverview";
import {AppState} from "../redux";
import {RouteManagesUsersOnly} from "./RouteManagesUsersOnly";

interface ContentRoutingOwnProps {
}

interface ContentRoutingStateProps {
}

const mapStateToProps = (state: AppState, ownProps: ContentRoutingOwnProps): ContentRoutingStateProps => {
  return {}
};

interface ContentRoutingDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: ContentRoutingOwnProps): ContentRoutingDispatchProps => {
  return {};
};

type ContentRoutingProps = ContentRoutingOwnProps & ContentRoutingStateProps & ContentRoutingDispatchProps;

class ContentRoutingComponent extends React.Component<ContentRoutingProps, {}> {
  public render() {
    return (
      <div className="App-content-container">
        <Switch>
          <Route exact={true} path="/cash-up" component={CashUp}/>
          <Route exact={true} path="/rota" component={Rota}/>
          <Route exact={true} path="/sign-in-sheet" component={SignIn}/>
          <Route exact={true} path="/weekly-overview" component={WeeklyOverview}/>
          <RouteManagesUsersOnly exact={true} path="/test" component={Test}/>
        </Switch>
      </div>
    )
  }
}

export const ContentRouting = connect<ContentRoutingStateProps, ContentRoutingDispatchProps, ContentRoutingOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ContentRoutingComponent);
