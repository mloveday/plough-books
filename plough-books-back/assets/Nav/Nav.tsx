import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {routeAllowed} from "../Auth/AuthNavService";
import {AuthState} from "../Auth/State/AuthState";
import {WorkTypes} from "../Enum/WorkTypes";
import {AppState} from "../redux";
import {Routes} from "../Routing/Routes";
import {UiState} from "../State/UiState";
import './Nav.scss';

interface NavOwnProps {
}

interface NavStateProps {
  authState: AuthState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: NavOwnProps): NavStateProps => {
  return {
    authState: state.authState,
    uiState: state.uiState,
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
    const date = this.props.uiState.currentDate;
    const routeCssSingle = 'single-link';
    const routeCssDouble = 'double-link';
    return (
      <nav className="App-nav">
        <ul className="App-nav-list">
          <li className={routeCssSingle}>
          {this.routeItem(Routes.cashUpUrl(date), "Cash up", Routes.CASH_UP)}
          </li>
          <li className={routeCssSingle}>
          {this.routeItem(Routes.weeklyPlanningUrl(date), "Weekly planning", Routes.WEEKLY_PLANNING)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.BAR), "Bar Rota", Routes.ROTA)}
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.KITCHEN), "Kitchen Rota", Routes.ROTA)}
          </li>
          <li className={routeCssSingle}>
          {this.routeItem(Routes.weeklyRotaUrl(date), "Weekly rota", Routes.WEEKLY_ROTA)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.signInUrl(date, WorkTypes.BAR), "Sign-in bar", Routes.SIGN_IN_SHEET)}
          {this.routeItem(Routes.signInUrl(date, WorkTypes.KITCHEN), "Sign-in kitchen", Routes.SIGN_IN_SHEET)}
          </li>
          <li className={routeCssSingle}>
          {this.routeItem(Routes.weeklyOverviewUrl(date), "Weekly overview", Routes.WEEKLY_OVERVIEW)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.STAFF_MEMBERS, "Staff")}
          {this.routeItem(Routes.STAFF_ROLES, "Staff roles")}
          </li>
          <li className={routeCssSingle}>
          {this.routeItem(Routes.CONSTANTS, "Constants")}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.USERS, "Users")}
          {this.routeItem(Routes.ROLES, "User Roles")}
          </li>
        </ul>
      </nav>
    )
  }

  private routeItem(route: string, text: string, baseRoute?: string): JSX.Element|null {
    if (this.isRouteAllowed(baseRoute ? baseRoute : route)) {
      return (
          <Link className="App-nav-anchor" to={route}>{text}</Link>
      );
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
