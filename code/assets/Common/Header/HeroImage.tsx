import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {AuthState} from "../../Redux/Auth/AuthState";

interface HeroImageOwnProps {
}

interface HeroImageStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: HeroImageOwnProps): HeroImageStateProps => {
  return {
    authState: state.authState,
  }
};

interface HeroImageDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: HeroImageOwnProps): HeroImageDispatchProps => {
  return {};
};

type HeroImageProps = HeroImageOwnProps & HeroImageStateProps & HeroImageDispatchProps;

class HeroImageComponent extends React.Component<HeroImageProps, {}> {
  public render() {
    if (this.props.authState.auth) {
      return (
        <div className="hero-image"><img src={this.props.authState.auth.profileObj.imageUrl}/></div>
      )
    }
    return <div>...</div>
  }
}

export const HeroImage = connect<HeroImageStateProps, HeroImageDispatchProps, HeroImageOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HeroImageComponent);
