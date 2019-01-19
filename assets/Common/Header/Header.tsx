import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../../redux";
import {Auth} from "../Auth/Auth";
import './Header.scss';
import {HeroImage} from "./HeroImage";
import {Status} from "./Status";

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
        <Link to={'/'} className={'home-link'}><h1 className="main-title"><img className={`title-icon`} src={require('../../images/plough-icon.png')} />Plough Books <FontAwesomeIcon className={`title-icon`} icon="book-dead" /></h1></Link>
        <Status />
      </header>
    )
  }
}

export const Header = connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
