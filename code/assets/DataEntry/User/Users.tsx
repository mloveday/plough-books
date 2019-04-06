import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {User} from "../../Model/User/User";
import {AppState} from "../../redux";
import {UsersExternalState} from "../../Redux/User/UsersExternalState";
import {UsersLocalState} from "../../Redux/User/UsersLocalState";
import {usersCreate, usersDataEntry, usersFetch} from "../../Redux/User/UsersRedux";
import {UserRolesExternalState} from "../../Redux/UserRole/UserRolesExternalState";
import {userRolesFetch} from "../../Redux/UserRole/UserRolesRedux";
import './Users.scss';

interface UsersOwnProps {
}

interface UsersStateProps {
  rolesExternalState: UserRolesExternalState,
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
    fetchRoles: () => dispatch(userRolesFetch()),
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
    const isCreatingNewUser = this.props.usersLocalState.isCreatingEntity;
    const newUser = this.props.usersLocalState.newEntity;
    return (
      <div className="users-data-entry">
        <div className="user-entity title">
          <div className="user-value">Email</div>
          <div className="user-value">Whitelisted</div>
          <div className="user-value">Blacklisted</div>
          <div className="user-value">Role</div>
          <div className="user-value">Manages users</div>
        </div>
        {this.props.usersLocalState.entities.map((user, key) => {
          const editing = user.entityId === this.props.usersLocalState.editingEntityId;
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
                    onChange={ev => this.dataEntry(user.with({role: this.props.rolesExternalState.externalState.entities.find(role => role.entityId === parseInt(ev.target.value, 10))}))}
                    className="user-value" value={user.role.entityId}>
              {this.props.rolesExternalState.externalState.entities.map((role, roleKey) => (
                <option key={roleKey} value={role.entityId}>{role.role}</option>
              ))}
            </select>
            <input disabled={true} type="checkbox" checked={user.role.managesUsers} className="user-value"/>
            <div className="user-edit-buttons">
              {!editing && <button type="button" onClick={() => this.editUser(user)}><FontAwesomeIcon icon="edit" /> Edit</button>}
              {editing && <button type="button" onClick={() => this.props.saveUser(user)}><FontAwesomeIcon icon="save" /> Save</button>}
              {editing && <button type="button" onClick={() => this.cancelEdit()}><FontAwesomeIcon icon="ban" /> Cancel</button>}
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
            <select onChange={ev => this.dataEntryNewUser(newUser.with({role: this.props.rolesExternalState.externalState.entities.find(role => role.entityId === parseInt(ev.target.value, 10))}))}
                    className="user-value" value={newUser.role.entityId}>
              {!newUser.role.isValid() && <option value={undefined}>Choose a role...</option>}
              {this.props.rolesExternalState.externalState.entities.map((role, roleKey) => (
                <option key={roleKey} value={role.entityId}>{role.role}</option>
              ))}
            </select>
            <input disabled={true} type="checkbox" checked={newUser.role.managesUsers} className="user-value"/>
            <div className="user-edit-buttons">
                <button type="button" disabled={!newUser.role.isValid()} onClick={() => this.props.saveUser(newUser)}><FontAwesomeIcon icon="save" /> Save</button>
                <button type="button" onClick={() => this.cancelEdit()}><FontAwesomeIcon icon="ban" /> Cancel</button>
            </div>
        </div>}
        {!isCreatingNewUser && !this.props.usersLocalState.isEditing() &&
        <button type="button" onClick={() => this.newUser()}><FontAwesomeIcon icon="plus-circle" /> New</button>}
      </div>
    )
  }

  private newUser() {
    this.props.updateUsers(this.props.usersLocalState.withNewEntity(User.default()));
  }

  private dataEntryNewUser(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withNewEntity(user));
  }

  private editUser(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withEntities([], user.entityId));
  }

  private cancelEdit() {
    this.props.updateUsers((this.props.usersExternalState.externalState));
  }

  private dataEntry(user: User) {
    this.props.updateUsers(this.props.usersLocalState.withEntities([user], user.entityId));
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