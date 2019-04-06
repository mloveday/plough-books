import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {AppState} from "../../redux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {Auth} from "../Auth/Auth";
import './Header.scss';
import {HeroImage} from "./HeroImage";
import {Status} from "./Status";
import {TestLinksComponent} from "./TestLinks";

interface HeaderOwnProps {
}

interface HeaderStateProps {
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: HeaderOwnProps): HeaderStateProps => {
  return {
    uiState: state.uiState,
  }
};

interface HeaderDispatchProps {
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: HeaderOwnProps): HeaderDispatchProps => {
  return {
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type HeaderProps = HeaderOwnProps & HeaderStateProps & HeaderDispatchProps;

class HeaderComponent extends React.Component<HeaderProps, {}> {
  public render() {
    return (
      <header className="Header">
        <button className={`nav-menu`} onClick={() => this.props.updateUi(this.props.uiState.withShouldShowNav(!this.props.uiState.showingNav))}><FontAwesomeIcon icon={`bars`}/></button>
        <HeroImage/>
        <Auth />
        <Link to={'/'} className={'home-link'}><h1 className="main-title"><img className={`title-icon`} src={require('../../images/plough-icon.png')} />Plough Books <FontAwesomeIcon className={`title-icon`} icon="book-dead" /></h1></Link>
        <TestLinksComponent/>
        <Status />
      </header>
    )
  }
}

export const Header = connect<HeaderStateProps, HeaderDispatchProps, HeaderOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);
