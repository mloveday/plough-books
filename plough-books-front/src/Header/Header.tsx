import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../redux";
import {HeroImage} from "./HeroImage";

interface HeaderOwnProps {
}

interface HeaderStateProps {
}

const mapStateToProps = (state: AppState, ownProps: HeaderOwnProps): HeaderStateProps => {
  return {}
};

interface HeaderDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: HeaderOwnProps): HeaderDispatchProps => {
  return {};
};

type HeaderProps = HeaderOwnProps & HeaderStateProps & HeaderDispatchProps;

class HeaderComponent extends React.Component<HeaderProps, {}> {
  public render() {
    return (
      <header className="App-header">
        <HeroImage/>
        <h1 className="App-title">Plough Books</h1>
      </header>
    )
  }
}

export const Header = connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
