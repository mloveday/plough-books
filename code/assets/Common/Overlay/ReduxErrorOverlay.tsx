import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {ErrorWithDispatch} from "../../Redux/Error/Error";
import {ErrorState, setErrorState} from "../../Redux/Error/ErrorRedux";
import "./Overlay.scss";
import "./ReduxErrorOverlay.scss";

interface ReduxErrorOverlayOwnProps {
}

interface ReduxErrorOverlayStateProps {
  errors: ErrorWithDispatch[];
}

const mapStateToProps = (state: AppState, ownProps: ReduxErrorOverlayOwnProps): ReduxErrorOverlayStateProps => {
  return {
    errors: state.errors.errors,
  }
};

interface ReduxErrorOverlayDispatchProps {
  setErrorState: (state: ErrorState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: ReduxErrorOverlayOwnProps): ReduxErrorOverlayDispatchProps => {
  return {
    setErrorState: (state: ErrorState) => dispatch(setErrorState(state)),
  }
};

type ReduxErrorOverlayProps = ReduxErrorOverlayOwnProps & ReduxErrorOverlayStateProps & ReduxErrorOverlayDispatchProps;

class ReduxErrorOverlayComponent extends React.Component<ReduxErrorOverlayProps, {}> {
  public render() {
    if (!this.shouldShowOverlay()) {
      return <div>{this.props.children}</div>;
    }
    return (
      <div className="App-overlay error">
        <div className="overlay-warning">Sorry, something went wrong</div>
        <div className="error-retry-buttons">
          {this.props.errors.map((error, key) => <div key={key} className={`error`}>
              <div className={`error-title`}>Error with {error.appArea}</div>
              <div className={`error-log`}>{error.error.message}</div>
              <button className="App-nav-anchor" onClick={() => this.dispatchAndRemoveError(error, key)}>Retry</button>
          </div>
          )}
        </div>
        <div className={`error-clear`}>
          <div className={`error-title`}>Clear errors and carry on</div>
          <div className={`error-log`}>Only do this if you really must. Take a screenshot and send it to your friendly developer first, though...</div>
          <button className="App-nav-anchor" onClick={() => this.clearErrors()}>Clear</button>
        </div>
      </div>
    )
  }

  private shouldShowOverlay(): boolean {
    return this.props.errors.length > 0;
  }

  private dispatchAndRemoveError(error: ErrorWithDispatch, key: number) {
    error.dispatch();
    this.props.setErrorState(new ErrorState(this.props.errors.filter((err, index) => index !== key)));
  }

  private clearErrors() {
    this.props.setErrorState(new ErrorState([]));
  }
}

export const ReduxErrorOverlay = connect<ReduxErrorOverlayStateProps, ReduxErrorOverlayDispatchProps, ReduxErrorOverlayOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ReduxErrorOverlayComponent);
