import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Auth} from "../Auth/Auth";
import {AppState} from "../redux";

interface NavOwnProps {
}

interface NavStateProps {
}

const mapStateToProps = (state: AppState, ownProps: NavOwnProps): NavStateProps => {
  return {}
};

interface NavDispatchProps {
}

const mapDispatchToProps = (dispatch: any, ownProps: NavOwnProps): NavDispatchProps => {
  return {};
};

type NavProps = NavOwnProps & NavStateProps & NavDispatchProps;

class NavComponent extends React.Component<NavProps, {}> {
  public render() {
    return (
      <nav className="App-nav">
        <ul className="App-nav-list">
          <li className="App-nav-item"><Auth /></li>
          <li className="App-nav-item"><Link className="App-nav-anchor" to="/cash-up">Cash up</Link></li>
          <li className="App-nav-item"><Link className="App-nav-anchor" to="/rota">Rota</Link></li>
          <li className="App-nav-item"><Link className="App-nav-anchor" to="/sign-in-sheet">Sign-in sheet</Link></li>
          <li className="App-nav-item"><Link className="App-nav-anchor" to="/weekly-overview">Weekly overview</Link></li>
          <li className="App-nav-item"><Link className="App-nav-anchor" to="/test">Test</Link></li>
        </ul>
      </nav>
    )
  }
}

export const Nav = connect<NavStateProps, NavDispatchProps, NavOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);
