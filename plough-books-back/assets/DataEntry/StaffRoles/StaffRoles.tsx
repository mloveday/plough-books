import * as React from "react";
import {connect} from "react-redux";
import {WorkTypes} from "../../Enum/WorkTypes";
import {AppState} from "../../redux";
import {getStaffRoleOrder} from "../../Util/SortingUtils";
import {StaffRole} from "../Rota/State/StaffRole";
import "./StaffRoles.scss";
import {StaffRolesExternalState} from "./State/StaffRolesExternalState";
import {StaffRolesLocalState} from "./State/StaffRolesLocalState";
import {staffRolesCreate, staffRolesDataEntry, staffRolesFetch} from "./State/StaffRolesRedux";

interface StaffRolesOwnProps {
}

interface StaffRolesStateProps {
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
}

const mapStateToProps = (state: AppState, ownProps: StaffRolesOwnProps): StaffRolesStateProps => {
  return {
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state. staffRolesLocalState,
  }
};

interface StaffRolesDispatchProps {
  fetchStaffRoles: () => void;
  saveStaffRole: (staffRole: StaffRole) => void;
  updateStaffRole: (staffRolesLocalState: StaffRolesLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffRolesOwnProps): StaffRolesDispatchProps => {
  return {
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    saveStaffRole: (staffRole: StaffRole) => dispatch(staffRolesCreate(staffRole)),
    updateStaffRole: (staffRolesLocalState: StaffRolesLocalState) => dispatch(staffRolesDataEntry(staffRolesLocalState)),
  };
};

type StaffRolesProps = StaffRolesOwnProps & StaffRolesStateProps & StaffRolesDispatchProps;

class StaffRolesComponent extends React.Component<StaffRolesProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const isCreatingNewRole = this.props.staffRolesLocalState.isCreatingRole;
    return (
      <div className="staff-roles-data-entry">
        <div className="staff-role-entity">
          <div>Role name</div>
          <div>Status</div>
          <div>Order in rota</div>
          <div>Type</div>
        </div>
        {this.props.staffRolesLocalState.roles.sort((a,b) => getStaffRoleOrder(a) < getStaffRoleOrder(b) ? -1 : 1)
          .map((role, key) => {
            const isEditingThisRole = !isCreatingNewRole && role.id === this.props.staffRolesLocalState.editingRoleId;
            return (
              <div className="staff-role-entity" key={key}>
                <input disabled={!isEditingThisRole} value={role.role} onChange={ev => this.updateStaffRole(role.with({'role': ev.target.value}))}/>
                <input disabled={!isEditingThisRole} value={role.status} onChange={ev => this.updateStaffRole(role.with({'status': ev.target.value}))}/>
                <input disabled={!isEditingThisRole} type='number' value={role.orderInRota} step={1} onChange={ev => this.updateStaffRole(role.with({'orderInRota': ev.target.value}))}/>
                <select disabled={!isEditingThisRole} value={role.type} onChange={ev => this.updateStaffRole(role.with({type: ev.target.value}))}>
                    <option value='bar'>Bar</option>
                    <option value='kitchen'>Kitchen</option>
                </select>
                {!isCreatingNewRole && !isEditingThisRole && !this.props.staffRolesLocalState.isEditing() &&
                <button type='button' onClick={() => this.updateStaffRole(role)}>Edit</button>}
                {isEditingThisRole && <button type='button' onClick={() => this.saveStaffRole(role)}>Save</button>}
                {isEditingThisRole && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
              </div>
            )
          }
        )}
        <div className="staff-role-entity">
          {isCreatingNewRole &&
          <input value={this.props.staffRolesLocalState.newRole.role}
                 onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newRole.with({'role': ev.target.value}))}/>
          }
          {isCreatingNewRole && <input value={this.props.staffRolesLocalState.newRole.status} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newRole.with({'status': ev.target.value}))}/>}
          {isCreatingNewRole && <input type='number' value={this.props.staffRolesLocalState.newRole.orderInRota} step={1} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newRole.with({'orderInRota': ev.target.value}))}/>}
          {isCreatingNewRole &&
            <select value={this.props.staffRolesLocalState.newRole.type} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newRole.with({type: ev.target.value}))}>
            <option value={WorkTypes.BAR}>Bar</option>
            <option value={WorkTypes.KITCHEN}>Kitchen</option>
          </select>}
          {!isCreatingNewRole && !this.props.staffRolesLocalState.isEditing() &&
          <button type='button' onClick={() => this.newStaffRole()}>New</button>}
          {isCreatingNewRole && <button type='button' onClick={() => this.saveStaffRole(this.props.staffRolesLocalState.newRole)}>Save</button>}
          {isCreatingNewRole && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
        </div>
      </div>
    )
  }

  private newStaffRole(staffRole: StaffRole = StaffRole.default()) {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withNewRole(staffRole));
  }

  private updateStaffRole(staffRole: StaffRole) {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withRoles([staffRole], staffRole.id));
  }

  private cancelEdit() {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withRoles(this.props.staffRolesExternalState.externalState.roles));
  }

  private saveStaffRole(staffRole: StaffRole) {
    this.props.saveStaffRole(staffRole);
  }

  private maintainStateWithUrl() {
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
  }
}

export const StaffRoles = connect<StaffRolesStateProps, StaffRolesDispatchProps, StaffRolesOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffRolesComponent);