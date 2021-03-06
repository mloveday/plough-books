import * as log from "loglevel";
import * as React from "react";
import GoogleLogin from 'react-google-login';
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {
  bootstrapFromLocalStorage,
  clearAuthentication,
  fetchCurrentUser,
  handleAuthenticationResponse
} from "../../Redux/Auth/AuthRedux";
import {AuthState} from '../../Redux/Auth/AuthState';
import {getResponseFromLocalStorage} from '../../Redux/Auth/AuthStorage';
import './Auth.scss';

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
  fetchCurrentUser: (onLoginDispatch: Array<() => void>) => void;
  handleAuthResponse: (response: any, onLoginDispatch: Array<() => void>) => void;
  signOut: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: AuthOwnProps): AuthDispatchProps => {
  return {
    bootstrapAuth: () => dispatch(bootstrapFromLocalStorage()),
    fetchCurrentUser: (onLoginDispatch: Array<() => void>) => dispatch(fetchCurrentUser(onLoginDispatch)),
    handleAuthResponse: (response, onLoginDispatch) => dispatch(handleAuthenticationResponse(response, onLoginDispatch)),
    signOut: () => dispatch(clearAuthentication()),
  };
};

type AuthProps = AuthOwnProps & AuthStateProps & AuthDispatchProps;

class AuthComponent extends React.Component<AuthProps, {}> {
  public render() {
    const cssClass = 'Auth-button';
    if (this.props.authState.isSignedInAndWaitingAuthorisation()) {
      return (
        <div className={cssClass}>Loading user...</div>
      )
    }

    if (this.props.authState.isSignedInAndAuthorised()) {
      return (
        <button className={cssClass} onClick={() => this.props.signOut()}>Logout</button>
      )
    }

    return (
      <GoogleLogin
        className={cssClass}
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
    this.props.handleAuthResponse(response, this.props.authState.onLoginDispatch);
  }

  private maintainAuthState() {
    if (!this.props.authState.isSignedIn() && getResponseFromLocalStorage()) {
      this.props.bootstrapAuth();
      return;
    }
    if (this.props.authState.isSignedInAndWaitingAuthorisation()) {
      this.props.fetchCurrentUser(this.props.authState.onLoginDispatch);
      return;
    }
  }
}

export const Auth = connect<AuthStateProps, AuthDispatchProps, AuthOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(AuthComponent);
