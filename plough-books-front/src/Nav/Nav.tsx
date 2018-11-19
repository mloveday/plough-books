import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Auth} from "../Auth/Auth";
import {routeAllowed} from "../Auth/AuthNavService";
import {AuthState} from "../Auth/State/AuthState";
import {AppState} from "../redux";
import {Routes} from "../Routing/Routes";

interface NavOwnProps {
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
    return (
      <nav className="App-nav">
        <ul className="App-nav-list">
          <li className="App-nav-item"><Auth /></li>
          {this.routeItem(Routes.cashUpUrl(moment()), "Cash up", Routes.CASH_UP)}
          {this.routeItem(Routes.rotaUrl(moment(), 'bar'), "Bar Rota", Routes.ROTA)}
          {this.routeItem(Routes.rotaUrl(moment(), 'kitchen'), "Kitchen Rota", Routes.ROTA)}
          {this.routeItem(Routes.SIGN_IN_SHEET, "Sign-in sheet")}
          {this.routeItem(Routes.WEEKLY_OVERVIEW, "Weekly overview")}
          {this.routeItem(Routes.USERS, "Users")}
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
