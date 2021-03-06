import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {CashUpPage} from "../../Model/Enum/CashUpPage";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {AppState} from "../../redux";
import {AuthState} from "../../Redux/Auth/AuthState";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {routeAllowed} from "../Auth/AuthNavService";
import {Routes} from "../Routing/Routes";
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
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: NavOwnProps): NavDispatchProps => {
  return {
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
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
          <li className={`${routeCssSingle} nav-menu-anchor`}>
            <div className={`App-nav-anchor`} onClick={() => this.props.updateUi(this.props.uiState.withShouldShowNav(false))}>
              <FontAwesomeIcon icon={`chevron-left`} className={`link-icon`} />
            </div>
          </li>
          <li className={routeCssSingle}>
            {this.routeItem(Routes.weeklyPlanningUrl(date), "Weekly planning", 'planning', 'calendar-week', Routes.WEEKLY_PLANNING)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.BAR), "Bar Rota", 'planning', 'calendar-day', Routes.ROTA)}
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.KITCHEN), "Kitchen Rota", 'planning', 'calendar-day', Routes.ROTA)}
          {this.routeItem(Routes.rotaUrl(date, WorkTypes.ANCILLARY), "Ancillary Rota", 'planning', 'calendar-day', Routes.ROTA)}
          </li>
          <li className={routeCssSingle}>
            {this.routeItem(Routes.cashUpUrl(date, CashUpPage.TILLS), "Cash up", 'recording', 'cash-register', Routes.CASH_UP)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.signInUrl(date, WorkTypes.BAR), "Sign-in bar", 'recording', 'calendar-check', Routes.SIGN_IN_SHEET)}
          {this.routeItem(Routes.signInUrl(date, WorkTypes.KITCHEN), "Sign-in kitchen", 'recording', 'calendar-check', Routes.SIGN_IN_SHEET)}
          {this.routeItem(Routes.signInUrl(date, WorkTypes.ANCILLARY), "Sign-in ancillary", 'recording', 'calendar-check', Routes.SIGN_IN_SHEET)}
          </li>
          <li className={routeCssDouble}>
            {this.routeItem(Routes.weeklyRotaUrl(date), "Weekly rota", 'planning', 'print', Routes.WEEKLY_ROTA)}
            {this.routeItem(Routes.weeklySignInUrl(date), "Weekly sign in", 'planning', 'print', Routes.WEEKLY_SIGN_IN)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.weeklyOverviewUrl(date), "Weekly overview", 'reviewing', 'calendar-alt', Routes.WEEKLY_OVERVIEW)}
          {this.routeItem(Routes.MONTHLY_FIGURES, "Monthly figures", 'reviewing', 'calendar-alt', Routes.MONTHLY_FIGURES)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.STAFF_MEMBERS, "Staff", 'admin', 'users')}
          {this.routeItem(Routes.STAFF_ROLES, "Staff roles", 'admin', 'users-cog')}
          {this.routeItem(Routes.holidayUrl(), "Holidays", 'admin', 'calendar-week', Routes.HOLIDAYS)}
          </li>
          <li className={routeCssDouble}>
          {this.routeItem(Routes.CONSTANTS, "Constants", 'admin', 'cogs')}
          {this.routeItem(Routes.ROTA_STAFFING_TEMPLATES, "Rota Templates", 'admin', 'cogs')}
          </li>
          {this.isRouteAllowed(Routes.USERS) && <li className={routeCssDouble}>
          {this.routeItem(Routes.USERS, "Users", 'admin', 'user-tie')}
          {this.routeItem(Routes.ROLES, "User Roles", 'admin', 'user-tag')}
          </li>}
        </ul>
      </nav>
    )
  }

  private routeItem(route: string, text: string, groupCss: string, icon: IconProp, baseRoute?: string): JSX.Element|null {
    if (this.isRouteAllowed(baseRoute ? baseRoute : route)) {
      return (
          <Link className={`App-nav-anchor ${groupCss}`} to={route} onClick={() => this.props.updateUi(this.props.uiState.withShouldShowNav(false))}>
            <FontAwesomeIcon icon={icon} className={`link-icon`} /> {text}
          </Link>
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
