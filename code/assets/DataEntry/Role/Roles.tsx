import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {EditButton} from "../../Common/Buttons/EditButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {UserRole} from "../../Model/UserRole/UserRole";
import {AppState} from "../../redux";
import {UserRolesExternalState} from "../../Redux/UserRole/UserRolesExternalState";
import {UserRolesLocalState} from "../../Redux/UserRole/UserRolesLocalState";
import {userRolesCreate, userRolesDataEntry, userRolesFetch} from "../../Redux/UserRole/UserRolesRedux";
import './Roles.scss';

interface RolesOwnProps {
}

interface RolesStateProps {
  rolesExternalState: UserRolesExternalState,
  rolesLocalState: UserRolesLocalState,
}

const mapStateToProps = (state: AppState, ownProps: RolesOwnProps): RolesStateProps => {
  return {
    rolesExternalState: state.rolesExternalState,
    rolesLocalState: state.rolesLocalState,
  }
};

interface RolesDispatchProps {
  fetchRoles: () => void,
  saveRole: (role: UserRole) => void,
  updateRoles: (state: UserRolesLocalState) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: RolesOwnProps): RolesDispatchProps => {
  return {
    fetchRoles: () => dispatch(userRolesFetch()),
    saveRole: role => dispatch(userRolesCreate(role)),
    updateRoles: state => dispatch(userRolesDataEntry(state)),
  };
};

type RolesProps = RolesOwnProps & RolesStateProps & RolesDispatchProps;

class RolesComponent extends React.Component<RolesProps, {}> {
  public componentDidMount() {
    this.maintainState();
  }

  public componentDidUpdate() {
    this.maintainState();
  }

  public render() {
    const isCreatingNewRole = this.props.rolesLocalState.isCreatingEntity;
    const newRole = this.props.rolesLocalState.newEntity;
    return (
      <div className="roles-data-entry">
        <div className="role-entity title">
          <div className="role-value">Role</div>
          <div className="role-value">Manages users</div>
        </div>
        {this.props.rolesLocalState.entities.map((role, key) => {
          const editing = this.props.rolesLocalState.isEditing() && this.props.rolesLocalState.editingEntityId === role.entityId;
          return (
            <div className="role-entity" key={key}>
              <input disabled={!editing} className="role-value" value={role.role}
                     onChange={ev => this.dataEntry(role.with({role: ev.target.value}))}/>
              <input disabled={!editing} type="checkbox" checked={role.managesUsers} className="role-value"
                     onChange={ev => this.dataEntry(role.with({managesUsers: ev.target.checked}))}/>
              <div className="role-edit-buttons">
                {!editing && <EditButton mini={true} clickFn={() => this.editRole(role)}/>}
                {editing && <SaveButton mini={true} clickFn={() => this.props.saveRole(role)}/>}
                {editing && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
              </div>
            </div>
          )
        })}
        {isCreatingNewRole && <div className="role-entity">
            <input className="role-value" value={newRole.role}
                   onChange={ev => this.dataEntryNewRole(newRole.with({role: ev.target.value}))}/>
            <input type="checkbox" checked={newRole.managesUsers} className="role-value"
                   onChange={ev => this.dataEntryNewRole(newRole.with({managesUsers: ev.target.checked}))}/>
            <div className="role-edit-buttons">
              <SaveButton mini={true} clickFn={() => this.props.saveRole(newRole)}/>
              <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>
            </div>
        </div>}
        {!isCreatingNewRole && !this.props.rolesLocalState.isEditing() &&
        <button type="button" onClick={() => this.newRole()}><FontAwesomeIcon icon="plus-circle" /> New</button>}
      </div>
    )
  }

  private newRole() {
    this.props.updateRoles(this.props.rolesLocalState.withNewEntity(UserRole.default()));
  }

  private dataEntryNewRole(role: UserRole) {
    this.props.updateRoles(this.props.rolesLocalState.withNewEntity(role));
  }

  private editRole(role: UserRole) {
    this.props.updateRoles(this.props.rolesLocalState.withEntity(role));
  }

  private cancelEdit() {
    this.props.updateRoles((this.props.rolesExternalState.externalState));
  }

  private dataEntry(role: UserRole) {
    this.props.updateRoles(this.props.rolesLocalState.withEntity(role));
  }

  private maintainState() {
    if (this.props.rolesExternalState.isEmpty()) {
      this.props.fetchRoles();
      return;
    }
  }
}

export const Roles = connect<RolesStateProps, RolesDispatchProps, RolesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RolesComponent);