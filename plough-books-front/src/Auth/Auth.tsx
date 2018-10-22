import * as log from "loglevel";
import * as React from "react";
import GoogleLogin from 'react-google-login';
import {connect} from "react-redux";
import '../App/App.css';
import {AppState} from "../redux";
import {
bootstrapFromLocalStorage,
clearAuthentication,
fetchCurrentUser,
handleAuthenticationResponse
} from './AuthActions';
import {AuthState} from './AuthState';
import {getResponseFromLocalStorage} from './local-storage/AuthStorage';

interface AuthOwnProps {
}

interface AuthStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: AuthOwnProps): AuthStateProps => {
  return {
    authState: state.authState,
  }
};

interface AuthDispatchProps {
  bootstrapAuth: () => void;
  fetchCurrentUser: () => void;
  handleAuthResponse: (response: any) => void;
  signOut: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: AuthOwnProps): AuthDispatchProps => {
  return {
    bootstrapAuth: () => dispatch(bootstrapFromLocalStorage()),
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    handleAuthResponse: (response) => dispatch(handleAuthenticationResponse(response)),
    signOut: () => dispatch(clearAuthentication()),
  };
};

type AuthProps = AuthOwnProps & AuthStateProps & AuthDispatchProps;

class AuthComponent extends React.Component<AuthProps, {}> {
  public render() {
    if (this.props.authState.isValid() && !this.props.authState.currentUser) {
      return (
        <div className="App-nav-anchor">Loading user...</div>
      )
    }

    if (this.props.authState.isValid() && this.props.authState.currentUser) {
      return (
        <button className="App-nav-anchor" title={this.props.authState.currentUser.email} onClick={() => this.props.signOut()}>Logout</button>
      )
    }

    return (
      <GoogleLogin
        className="App-nav-anchor"
        clientId="491973077715-1oqkalirg0v7gmdrehuv605nf3sju2si.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={response => this.responseGoogle(response)}
        onFailure={response => this.errorGoogle(response)}
      />
    )
  }

  public componentDidUpdate() {
    this.maintainAuthState();
  }

  public componentDidMount() {
    this.maintainAuthState();
  }

  public responseGoogle(response: any) {
    this.props.handleAuthResponse(response);
  }

  public errorGoogle(error: any) {
    log.error(error);
  }

  private maintainAuthState() {
    if (!this.props.authState.isValid() && getResponseFromLocalStorage()) {
      this.props.bootstrapAuth();
      return;
    }
    if (this.props.authState.isValid() && !this.props.authState.hasCurrentUser()) {
      this.props.fetchCurrentUser();
      return;
    }
  }
}

export const Auth = connect<AuthStateProps, AuthDispatchProps, AuthOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
