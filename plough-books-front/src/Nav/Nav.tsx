import * as React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Auth} from "../Auth/Auth";
import {AuthState} from "../Auth/State/AuthState";
import {AppState} from "../redux";

interface NavOwnProps {
}

interface NavStateProps {
  authState: AuthState;
}

const mapStateToProps = (state: AppState, ownProps: NavOwnProps): NavStateProps => {
  return {
    authState: state.authState,
  }
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
          {this.props.authState.currentUser && this.props.authState.currentUser.role.managesUsers &&
            <li className="App-nav-item"><Link className="App-nav-anchor" to="/test">Test</Link></li>}
        </ul>
      </nav>
    )
  }
}

export const Nav = connect<NavStateProps, NavDispatchProps, NavOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(NavComponent);
