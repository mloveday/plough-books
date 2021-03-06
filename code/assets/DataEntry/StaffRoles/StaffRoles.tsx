import * as React from "react";
import {connect} from "react-redux";
import {EditButton} from "../../Common/Buttons/EditButton";
import {NewButton} from "../../Common/Buttons/NewButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {StaffRoleStatus} from "../../Model/Enum/StaffRoleStatus";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {AppState} from "../../redux";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {StaffRolesLocalState} from "../../Redux/StaffRole/StaffRolesLocalState";
import {staffRolesCreate, staffRolesDataEntry, staffRolesFetch} from "../../Redux/StaffRole/StaffRolesRedux";
import {getStaffRoleOrder} from "../../Util/SortingUtils";
import "./StaffRoles.scss";

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
    const isCreatingNewRole = this.props.staffRolesLocalState.isCreatingEntity;
    return (
      <div className="staff-roles-data-entry">
        <div className="staff-role-entity">
          <div>Role name</div>
          <div>Status</div>
          <div>Order in rota</div>
          <div>Type</div>
        </div>
        {this.props.staffRolesLocalState.entities.sort((a,b) => getStaffRoleOrder(a) < getStaffRoleOrder(b) ? -1 : 1)
          .map((role, key) => {
            const isEditingThisRole = !isCreatingNewRole && role.id === this.props.staffRolesLocalState.editingEntityId;
            return (
              <div className="staff-role-entity" key={key}>
                <input disabled={!isEditingThisRole} value={role.role} onChange={ev => this.updateStaffRole(role.with({'role': ev.target.value}))}/>
                {role.status === StaffRoleStatus.IMPORTED && <div>{role.status}</div>}
                {role.status !== StaffRoleStatus.IMPORTED && <select disabled={!isEditingThisRole} value={role.status} onChange={ev => this.updateStaffRole(role.with({'status': ev.target.value}))}>
                  <option value={StaffRoleStatus.ACTIVE}>Active</option>
                  <option value={StaffRoleStatus.INACTIVE}>Inactive</option>
                </select>}
                <input disabled={!isEditingThisRole} type='number' value={role.orderInRota} step={1} onChange={ev => this.updateStaffRole(role.with({'orderInRota': ev.target.value}))}/>
                <select disabled={!isEditingThisRole} value={role.type} onChange={ev => this.updateStaffRole(role.with({type: ev.target.value}))}>
                  <option value={WorkTypes.BAR}>Bar</option>
                  <option value={WorkTypes.KITCHEN}>Kitchen</option>
                  <option value={WorkTypes.ANCILLARY}>Ancillary</option>
                </select>
                <div className="staff-role-edit-buttons">
                  {!isEditingThisRole && <EditButton disabled={isCreatingNewRole || this.props.staffRolesLocalState.isEditing()} mini={true} clickFn={() => this.updateStaffRole(role)}/>}
                  {isEditingThisRole && <SaveButton mini={true} clickFn={() => this.saveStaffRole(role)}/>}
                  {isEditingThisRole && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
                </div>
              </div>
            )
          }
        )}
        <div className="staff-role-entity">
          {isCreatingNewRole &&
          <input value={this.props.staffRolesLocalState.newEntity.role}
                 onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newEntity.with({'role': ev.target.value}))}/>
          }
          {isCreatingNewRole &&
          <select value={this.props.staffRolesLocalState.newEntity.status} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newEntity.with({'status': ev.target.value}))}>
              <option value={StaffRoleStatus.ACTIVE}>Active</option>
              <option value={StaffRoleStatus.INACTIVE}>Inactive</option>
          </select>}
          {isCreatingNewRole && <input type='number' value={this.props.staffRolesLocalState.newEntity.orderInRota} step={1} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newEntity.with({'orderInRota': ev.target.value}))}/>}
          {isCreatingNewRole &&
            <select value={this.props.staffRolesLocalState.newEntity.type} onChange={ev => this.newStaffRole(this.props.staffRolesLocalState.newEntity.with({type: ev.target.value}))}>
            <option value={WorkTypes.BAR}>Bar</option>
            <option value={WorkTypes.KITCHEN}>Kitchen</option>
            <option value={WorkTypes.ANCILLARY}>Ancillary</option>
          </select>}
          <div className="staff-role-edit-buttons">
            {!isCreatingNewRole && <NewButton disabled={this.props.staffRolesLocalState.isEditing()} mini={true} clickFn={() => this.newStaffRole()}/>}
            {isCreatingNewRole && <SaveButton mini={true} clickFn={() => this.saveStaffRole(this.props.staffRolesLocalState.newEntity)}/>}
            {isCreatingNewRole && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
          </div>
        </div>
      </div>
    )
  }

  private newStaffRole(staffRole: StaffRole = StaffRole.default()) {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withNewEntity(staffRole));
  }

  private updateStaffRole(staffRole: StaffRole) {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withEntities([staffRole], staffRole.id));
  }

  private cancelEdit() {
    this.props.updateStaffRole(this.props.staffRolesLocalState.withEntities([]));
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