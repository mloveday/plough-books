import * as React from "react";
import {connect} from "react-redux";
import {Auth} from "../Auth/Auth";
import {AppState} from "../redux";
import './Header.scss';
import {HeroImage} from "./HeroImage";
import {Link} from "react-router-dom";

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
      <header className="Header">
        <HeroImage/>
        <Auth />
        <Link to={'/'} className={'home-link'}><h1 className="main-title">Plough Books</h1></Link>
      </header>
    )
  }
}

export const Header = connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
