import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Switch} from "react-router";
import {AuthState} from "../Auth/State/AuthState";
import {CashUp} from "../DataEntry/CashUp/CashUp";
import {Rota} from "../DataEntry/Rota/Rota";
import {SignIn} from "../DataEntry/SignIn/SignIn";
import {StaffMembers} from "../DataEntry/StaffMembers/StaffMembers";
import {StaffRoles} from "../DataEntry/StaffRoles/StaffRoles";
import {WeeklyOverview} from "../DataVisualisation/WeeklyOverview/WeeklyOverview";
import {WorkTypes} from "../Enum/WorkTypes";
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
            <RouteWithAuth exact={true} path={Routes.signInRoute()} component={SignIn}/>
            <RouteWithAuth exact={true} path={Routes.weeklyOverviewRoute()} component={WeeklyOverview}/>
            <RouteWithAuth exact={true} path={Routes.STAFF_MEMBERS} component={StaffMembers}/>
            <RouteWithAuth exact={true} path={Routes.STAFF_ROLES} component={StaffRoles}/>
            <Redirect to={Routes.weeklyOverviewUrl(moment())} exact={false} path={Routes.WEEKLY_OVERVIEW} />
            <Redirect to={Routes.cashUpUrl(moment())} exact={false} path={Routes.CASH_UP} />
            <Redirect to={Routes.rotaUrl(moment(), WorkTypes.BAR)} exact={false} path={Routes.ROTA} />
            <Redirect to={Routes.signInUrl(moment(), WorkTypes.BAR)} exact={false} path={Routes.SIGN_IN_SHEET} />
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
