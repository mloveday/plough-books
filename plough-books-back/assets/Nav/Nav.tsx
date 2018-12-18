import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link, match} from "react-router-dom";
import {Auth} from "../Auth/Auth";
import {routeAllowed} from "../Auth/AuthNavService";
import {AuthState} from "../Auth/State/AuthState";
import {WorkTypes} from "../Enum/WorkTypes";
import {AppState} from "../redux";
import {Routes} from "../Routing/Routes";
import {startOfWeek} from "../Util/DateUtils";

interface NavOwnProps {
  match: match<{
    weekNumber?: string,
    year?: string,
    date?: string,
  }>;
}

interface NavStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: NavOwnProps): NavStateProps => {
  return {
    authState: state.authState,
  }
};

interface NavDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: NavOwnProps): NavDispatchProps => {
  return {};
};

type NavProps = NavOwnProps & NavStateProps & NavDispatchProps;

class NavComponent extends React.Component<NavProps, {}> {
  public render() {
    let date = moment();
    if (this.props.match.params.date) {
      date = moment(this.props.match.params.date);
    } else if (this.props.match.params.weekNumber && this.props.match.params.year) {
      date = startOfWeek(parseInt(this.props.match.params.year, 10), parseInt(this.props.match.params.weekNumber, 10))
    }
    return (
      <nav className="App-nav">
        <ul className="App-nav-list">
          <li className="App-nav-item"><Auth /></li>
          {this.routeItem(Routes.cashUpUrl(date), "Cash up", Routes.CASH_UP)}
          {this.routeItem(Routes.weeklyPlanningUrl(date), "Weekly planning", Routes.WEEKLY_PLANNING)}
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.BAR), "Bar Rota", Routes.ROTA)}
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.KITCHEN), "Kitchen Rota", Routes.ROTA)}
          {this.routeItem(Routes.signInUrl(date, WorkTypes.BAR), "Sign-in bar", Routes.SIGN_IN_SHEET)}
          {this.routeItem(Routes.signInUrl(date, WorkTypes.KITCHEN), "Sign-in kitchen", Routes.SIGN_IN_SHEET)}
          {this.routeItem(Routes.weeklyOverviewUrl(date), "Weekly overview", Routes.WEEKLY_OVERVIEW)}
          {this.routeItem(Routes.STAFF_MEMBERS, "Staff")}
          {this.routeItem(Routes.STAFF_ROLES, "Staff roles")}
          {this.routeItem(Routes.CONSTANTS, "Constants")}
          {this.routeItem(Routes.USERS, "Users")}
          {this.routeItem(Routes.ROLES, "User Roles")}
        </ul>
      </nav>
    )
  }

  private routeItem(route: string, text: string, baseRoute?: string): JSX.Element|null {
    if (this.isRouteAllowed(baseRoute ? baseRoute : route)) {
      return (<li className="App-nav-item"><Link className="App-nav-anchor" to={route}>{text}</Link></li>);
    }
    return null;
  }

  private isRouteAllowed(route:string): boolean {
    return !!this.props.authState.currentUser && routeAllowed(route, this.props.authState.currentUser);
  }
}

export const Nav = connect<NavStateProps, NavDispatchProps, NavOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);
