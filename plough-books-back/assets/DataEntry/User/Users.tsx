import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {UsersExternalState} from "./State/UsersExternalState";
import {UsersLocalState} from "./State/UsersLocalState";
import {usersFetch} from "./State/UsersRedux";
import './Users.css';

interface UsersOwnProps {
}

interface UsersStateProps {
  usersExternalState: UsersExternalState,
  usersLocalState: UsersLocalState,
}

const mapStateToProps = (state: AppState, ownProps: UsersOwnProps): UsersStateProps => {
  return {
    usersExternalState: state.usersExternalState,
    usersLocalState: state.usersLocalState,
  }
};

interface UsersDispatchProps {
  fetchUsers: () => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: UsersOwnProps): UsersDispatchProps => {
  return {
    fetchUsers: () => dispatch(usersFetch()),
  };
};

type UsersProps = UsersOwnProps & UsersStateProps & UsersDispatchProps;

class UsersComponent extends React.Component<UsersProps, {}> {
  public componentDidMount() {
    this.maintainState();
  }

  public componentDidUpdate() {
    this.maintainState();
  }

  public render() {
    return (
      <div>
        <div className="user-entity title">
          <div className="user-value">Email</div>
          <div className="user-value">Whitelisted</div>
          <div className="user-value">Blacklisted</div>
          <div className="user-value">Role</div>
          <div className="user-value">Manages users</div>
        </div>
        {this.props.usersLocalState.users.map((user, key) => (
          <div className="user-entity" key={key}>
            <div className="user-value">{user.email}</div>
            <div className="user-value">{user.whitelisted ? 'Whitelisted' : '-'}</div>
            <div className="user-value">{user.blacklisted ? 'Blacklisted' : '-'}</div>
            <div className="user-value">{user.role.role}</div>
            <div className="user-value">{user.role.managesUsers ? 'Manages users' : '-'}</div>
          </div>
        ))}
      </div>
    )
  }

  private maintainState() {
    if (this.props.usersExternalState.isEmpty()) {
      this.props.fetchUsers();
    }
  }
}

export const Users = connect<UsersStateProps, UsersDispatchProps, UsersOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UsersComponent);