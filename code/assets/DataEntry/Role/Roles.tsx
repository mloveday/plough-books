import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as React from "react";
import {connect} from "react-redux";
import {Role} from "../../Model/UserRole/Role";
import {AppState} from "../../redux";
import './Roles.scss';
import {RolesExternalState} from "./State/RolesExternalState";
import {RolesLocalState} from "./State/RolesLocalState";
import {rolesCreate, rolesDataEntry, rolesFetch} from "./State/RolesRedux";

interface RolesOwnProps {
}

interface RolesStateProps {
  rolesExternalState: RolesExternalState,
  rolesLocalState: RolesLocalState,
}

const mapStateToProps = (state: AppState, ownProps: RolesOwnProps): RolesStateProps => {
  return {
    rolesExternalState: state.rolesExternalState,
    rolesLocalState: state.rolesLocalState,
  }
};

interface RolesDispatchProps {
  fetchRoles: () => void,
  saveRole: (role: Role) => void,
  updateRoles: (state: RolesLocalState) => void,
}

const mapDispatchToProps = (dispatch: any, ownProps: RolesOwnProps): RolesDispatchProps => {
  return {
    fetchRoles: () => dispatch(rolesFetch()),
    saveRole: role => dispatch(rolesCreate(role)),
    updateRoles: state => dispatch(rolesDataEntry(state)),
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
                {!editing && <button type="button" onClick={() => this.editRole(role)}><FontAwesomeIcon icon="edit" /> Edit</button>}
                {editing && <button type="button" onClick={() => this.props.saveRole(role)}><FontAwesomeIcon icon="save" /> Save</button>}
                {editing && <button type="button" onClick={() => this.cancelEdit()}><FontAwesomeIcon icon="ban" /> Cancel</button>}
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
                <button type="button" onClick={() => this.props.saveRole(newRole)}><FontAwesomeIcon icon="save" /> Save</button>
                <button type="button" onClick={() => this.cancelEdit()}><FontAwesomeIcon icon="ban" /> Cancel</button>
            </div>
        </div>}
        {!isCreatingNewRole && !this.props.rolesLocalState.isEditing() &&
        <button type="button" onClick={() => this.newRole()}><FontAwesomeIcon icon="plus-circle" /> New</button>}
      </div>
    )
  }

  private newRole() {
    this.props.updateRoles(this.props.rolesLocalState.withNewEntity(Role.default()));
  }

  private dataEntryNewRole(role: Role) {
    this.props.updateRoles(this.props.rolesLocalState.withNewEntity(role));
  }

  private editRole(role: Role) {
    this.props.updateRoles(this.props.rolesLocalState.updateEntity(role));
  }

  private cancelEdit() {
    this.props.updateRoles((this.props.rolesExternalState.externalState));
  }

  private dataEntry(role: Role) {
    this.props.updateRoles(this.props.rolesLocalState.updateEntity(role));
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