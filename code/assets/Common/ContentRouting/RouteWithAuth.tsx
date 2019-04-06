import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Route, RouteProps} from "react-router";
import {AppState} from "../../redux";
import {AuthState} from "../../Redux/Auth/AuthState";
import {getResponseFromLocalStorage} from "../../Redux/Auth/AuthStorage";

interface RouteWithAuthOwnProps {
  managesUsers?: boolean;
}

interface RouteWithAuthStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: RouteWithAuthOwnProps): RouteWithAuthStateProps => {
  return {
    authState: state.authState,
  }
};

interface RouteWithAuthDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: RouteWithAuthOwnProps): RouteWithAuthDispatchProps => {
  return {};
};

type RouteWithAuthProps =
  RouteWithAuthOwnProps
  & RouteWithAuthStateProps
  & RouteWithAuthDispatchProps;

class RouteWithAuthComponent extends React.Component<RouteWithAuthProps, {}> {
  public render() {
    if (this.waitingOnUserFromBackend()) {
      return null; // prevents redirect when page manually refreshed
    }
    if (this.shouldRedirect()) {
      return <Redirect to="/" />;
    }
    return <Route {...this.props}/>
  }

  private shouldRedirect(): boolean {
    return (this.props.managesUsers !== undefined && this.props.managesUsers !== this.userManagesUsers());
  }

  private waitingOnUserFromBackend() {
    return getResponseFromLocalStorage() && !this.props.authState.currentUser;
  }

  private userManagesUsers() {
    return this.props.authState.currentUser && this.props.authState.currentUser.role.managesUsers;
  }
}

export const RouteWithAuth = connect<RouteWithAuthStateProps, RouteWithAuthDispatchProps, RouteProps & RouteWithAuthOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RouteWithAuthComponent);
