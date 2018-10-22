import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Route, RouteProps} from "react-router";
import {AuthState} from "../Auth/State/AuthState";
import {getResponseFromLocalStorage} from "../Auth/State/AuthStorage";
import {AppState} from "../redux";

interface RouteManagesUsersOnlyOwnProps {
}

interface RouteManagesUsersOnlyStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: RouteManagesUsersOnlyOwnProps): RouteManagesUsersOnlyStateProps => {
  return {
    authState: state.authState,
  }
};

interface RouteManagesUsersOnlyDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: RouteManagesUsersOnlyOwnProps): RouteManagesUsersOnlyDispatchProps => {
  return {};
};

type RouteManagesUsersOnlyProps =
  RouteManagesUsersOnlyOwnProps
  & RouteManagesUsersOnlyStateProps
  & RouteManagesUsersOnlyDispatchProps;

class RouteManagesUsersOnlyComponent extends React.Component<RouteManagesUsersOnlyProps, {}> {
  public render() {
    if (this.waitingOnUserFromBackend()) {
      return null; // prevents redirect when page manually refreshed
    }
    if (this.userManagesUsers()) {
      return <Route {...this.props}/>
    }
    return <Redirect to="/" />;
  }

  private waitingOnUserFromBackend() {
    return getResponseFromLocalStorage() && !this.props.authState.currentUser;
  }

  private userManagesUsers() {
    return this.props.authState.currentUser && this.props.authState.currentUser.role.managesUsers;
  }
}

export const RouteManagesUsersOnly = connect<RouteManagesUsersOnlyStateProps, RouteManagesUsersOnlyDispatchProps, RouteProps & RouteManagesUsersOnlyOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RouteManagesUsersOnlyComponent);
