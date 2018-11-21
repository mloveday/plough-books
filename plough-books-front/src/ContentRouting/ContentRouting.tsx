import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Switch} from "react-router";
import {AuthState} from "../Auth/State/AuthState";
import {CashUp} from "../DataEntry/CashUp/CashUp";
import {Rota} from "../DataEntry/Rota/Rota";
import {SignIn} from "../DataEntry/SignIn/SignIn";
import {WeeklyOverview} from "../DataVisualisation/WeeklyOverview/WeeklyOverview";
import {AppState} from "../redux";
import {Routes} from "../Routing/Routes";
import {RouteWithAuth} from "./RouteWithAuth";

interface ContentRoutingOwnProps {
}

interface ContentRoutingStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: ContentRoutingOwnProps): ContentRoutingStateProps => {
  return {
    authState: state.authState,
  }
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
        {/*Do not show any content unless authorised*/}
        {this.props.authState.isSignedInAndAuthorised() &&
          <Switch>
            <RouteWithAuth exact={true} path={Routes.cashUpRoute()} component={CashUp}/>
            <RouteWithAuth exact={true} path={Routes.rotaRoute()} component={Rota}/>
            <RouteWithAuth exact={true} path={Routes.SIGN_IN_SHEET} component={SignIn}/>
            <RouteWithAuth exact={true} path={Routes.weeklyOverviewRoute()} component={WeeklyOverview}/>
            <Redirect to={Routes.cashUpUrl(moment())} exact={false} path={Routes.CASH_UP} /> {/* Redirect /cash-up to /cash-up/:today */}
            <Redirect to={Routes.rotaUrl(moment(), 'bar')} exact={false} path={Routes.ROTA} /> {/* Redirect /rota to /rota/:today/bar */}
          </Switch>
        }
      </div>
    )
  }
}

export const ContentRouting = connect<ContentRoutingStateProps, ContentRoutingDispatchProps, ContentRoutingOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ContentRoutingComponent);
