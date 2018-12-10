import * as React from "react";
import {connect} from "react-redux";
import {User} from "../../Auth/Model/User";
import {AppState} from "../../redux";
import {RolesExternalState} from "../Role/State/RolesExternalState";
import {rolesFetch} from "../Role/State/RolesRedux";
import {UsersExternalState} from "./State/UsersExternalState";
import {UsersLocalState} from "./State/UsersLocalState";
import {usersCreate, usersDataEntry, usersFetch} from "./State/UsersRedux";
import './Users.scss';

interface UsersOwnProps {
}

interface UsersStateProps {
  rolesExternalState: RolesExternalState,
  usersExternalState: UsersExternalState,
  usersLocalState: UsersLocalState,
}

const mapStateToProps = (state: AppState, ownProps: UsersOwnProps): UsersStateProps => {
  return {
    rolesExternalState: state.rolesExternalState,
    usersExternalState: state.usersExternalState,
    usersLocalState: state.usersLocalState,
  }
};

interface UsersDispatchProps {
  fetchUsers: () => void,
  fetchRoles: () => void,
  saveUser: (user: User) => void,
  updateUsers: (state: UsersLocalState) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: UsersOwnProps): UsersDispatchProps => {
  return {
    fetchUsers: () => dispatch(usersFetch()),
    fetchRoles: () => dispatch(rolesFetch()),
    saveUser: user => dispatch(usersCreate(user)),
    updateUsers: state => dispatch(usersDataEntry(state)),
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
    const isCreatingNewUser = this.props.usersLocalState.isCreatingUser;
    const newUser = this.props.usersLocalState.newUser;
    return (
      <div className="users-data-entry">
        <div className="user-entity title">
          <div className="user-value">Email</div>
          <div className="user-value">Whitelisted</div>
          <div className="user-value">Blacklisted</div>
          <div className="user-value">Role</div>
          <div className="user-value">Manages users</div>
        </div>
        {this.props.usersLocalState.users.map((user, key) => {
          const editing = user.userId === this.props.usersLocalState.editingUserId;
          return (
          <div className="user-entity" key={key}>
            <input disabled={!editing} className="user-value" value={user.email}
                   onChange={ev => this.dataEntry(user.with({email: ev.target.value}))}/>
            <input disabled={!editing} type="checkbox"
                   onChange={ev => this.dataEntry(user.with({whitelisted: ev.target.checked}))}
                   checked={user.whitelisted} className="user-value"/>
            <input disabled={!editing} type="checkbox"
                   onChange={ev => this.dataEntry(user.with({blacklisted: ev.target.checked}))}
                   checked={user.blacklisted} className="user-value"/>
            <select disabled={!editing}
                    onChange={ev => this.dataEntry(user.with({role: {id: parseInt(ev.target.value)}}))}
                    className="user-value" value={user.role.roleId}>
              {this.props.rolesExternalState.externalState.roles.map((role, roleKey) => (
                <option key={roleKey} value={role.roleId}>{role.role}</option>
              ))}
            </select>
            <input disabled={true} type="checkbox" checked={user.role.managesUsers} className="user-value"/>
            <div className="user-edit-buttons">
              {!editing && <button type="button" onClick={() => this.editUser(user)}>Edit</button>}
              {editing && <button type="button" onClick={() => this.cancelEdit()}>Cancel</button>}
              {editing && <button type="button" onClick={() => this.props.saveUser(user)}>Save</button>}
            </div>
          </div>
          )
        })}
        {isCreatingNewUser && <div className="user-entity">
            <input className="user-value" value={newUser.email}
                   onChange={ev => this.dataEntryNewUser(newUser.with({email: ev.target.value}))}/>
            <input type="checkbox"
                   onChange={ev => this.dataEntryNewUser(newUser.with({whitelisted: ev.target.checked}))}
                   checked={newUser.whitelisted} className="user-value"/>
            <input type="checkbox"
                   onChange={ev => this.dataEntryNewUser(newUser.with({blacklisted: ev.target.checked}))}
                   checked={newUser.blacklisted} className="user-value"/>
            <select onChange={ev => this.dataEntryNewUser(newUser.with({role: {id: parseInt(ev.target.value)}}))}
                    className="user-value" value={newUser.role.roleId}>
              {this.props.rolesExternalState.externalState.roles.map((role, roleKey) => (
                <option key={roleKey} value={role.roleId}>{role.role}</option>
              ))}
            </select>
            <input disabled={true} type="checkbox" checked={newUser.role.managesUsers} className="user-value"/>
            <div className="user-edit-buttons">
                <button type="button" onClick={() => this.cancelEdit()}>Cancel</button>
                <button type="button" onClick={() => this.props.saveUser(newUser)}>Save</button>
            </div>
        </div>}
        {!isCreatingNewUser && !this.props.usersLocalState.isEditing() &&
        <button type="button" onClick={() => this.newUser()}>New</button>}
      </div>
    )
  }

  private newUser() {
    this.props.updateUsers(this.props.usersLocalState.withNewUser(User.default()));
  }

  private dataEntryNewUser(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withNewUser(user));
  }

  private editUser(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withUsers([], user.userId));
  }

  private cancelEdit() {
    this.props.updateUsers((this.props.usersExternalState.externalState));
  }

  private dataEntry(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withUsers([user], user.userId));
  }

  private maintainState() {
    if (this.props.rolesExternalState.isEmpty()) {
      this.props.fetchRoles();
    }
    if (this.props.usersExternalState.isEmpty()) {
      this.props.fetchUsers();
    }
  }
}

export const Users = connect<UsersStateProps, UsersDispatchProps, UsersOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(UsersComponent);