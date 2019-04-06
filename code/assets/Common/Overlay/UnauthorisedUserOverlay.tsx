import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {clearAuthentication} from "../../Redux/Auth/AuthRedux";
import {AuthState} from "../../Redux/Auth/AuthState";
import {Auth} from "../Auth/Auth";
import "./Overlay.scss";

interface UnauthorisedUserOverlayOwnProps {
}

interface UnauthorisedUserOverlayStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: UnauthorisedUserOverlayOwnProps): UnauthorisedUserOverlayStateProps => {
  return {
    authState: state.authState,
  }
};

interface UnauthorisedUserOverlayDispatchProps {
  signOut: () => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: UnauthorisedUserOverlayOwnProps): UnauthorisedUserOverlayDispatchProps => {
  return {
    signOut: () => dispatch(clearAuthentication()),
  }
};

type UnauthorisedUserOverlayProps =
  UnauthorisedUserOverlayOwnProps
  & UnauthorisedUserOverlayStateProps
  & UnauthorisedUserOverlayDispatchProps;

class UnauthorisedUserOverlayComponent extends React.Component<UnauthorisedUserOverlayProps, {}> {
  public render() {
    if (!this.shouldShowOverlay()) {
      return <div>{this.props.children}</div>;
    }
    return (
      <div className="App-overlay">
        <div className="overlay-warning">You are not authorised to access this dashboard.</div>
        <div className="overlay-buttons">
          <Auth/>
          <button className="App-nav-anchor" onClick={() => this.props.signOut()}>Logout</button>
        </div>
      </div>
    )
  }

  private shouldShowOverlay(): boolean {
    return this.props.authState.isSignedInAndUnauthorised();
  }
}

export const UnauthorisedUserOverlay = connect<UnauthorisedUserOverlayStateProps, UnauthorisedUserOverlayDispatchProps, UnauthorisedUserOverlayOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UnauthorisedUserOverlayComponent);
