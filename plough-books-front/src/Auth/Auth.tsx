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
} from './State/AuthActions';
import {AuthState} from './State/AuthState';
import {getResponseFromLocalStorage} from './State/AuthStorage';

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
    if (this.props.authState.isSignedInAndWaitingAuthorisation()) {
      return (
        <div className="App-nav-anchor">Loading user...</div>
      )
    }

    if (this.props.authState.isSignedInAndUnauthorised()) {
      return (
        <button className="App-nav-anchor" onClick={() => this.props.signOut()}>Logout</button>
      )
    }

    if (this.props.authState.isSignedInAndAuthorised()) {
      return (
        <button className="App-nav-anchor" onClick={() => this.props.signOut()}>Logout</button>
      )
    }

    return (
      <GoogleLogin
        className="App-nav-anchor"
        clientId="491973077715-1oqkalirg0v7gmdrehuv605nf3sju2si.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={response => this.responseGoogle(response)}
        onFailure={response => log.error(response)}
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

  private maintainAuthState() {
    if (!this.props.authState.isSignedIn() && getResponseFromLocalStorage()) {
      this.props.bootstrapAuth();
      return;
    }
    if (this.props.authState.isSignedInAndWaitingAuthorisation()) {
      this.props.fetchCurrentUser();
      return;
    }
  }
}

export const Auth = connect<AuthStateProps, AuthDispatchProps, AuthOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
