import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {getStaffRoleOrder} from "../../Util/SortingUtils";
import {StaffRole} from "../Rota/State/StaffRole";
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
    return (
      <div>
        {this.props.staffRolesLocalState.roles.sort((a,b) => getStaffRoleOrder(a) < getStaffRoleOrder(b) ? -1 : 1)
          .map((role, key) => {
            const isEditingRole = role.id === this.props.staffRolesLocalState.editingRoleId;
            return (
              <div key={key}>
                <input disabled={!isEditingRole} value={role.role} onChange={ev => this.updateStaffRole(role.with({'name': ev.target.value}))}/>
                <input disabled={!isEditingRole} value={role.status} onChange={ev => this.updateStaffRole(role.with({'status': ev.target.value}))}/>
                <input disabled={!isEditingRole} type='number' value={role.orderInRota} step={1} onChange={ev => this.updateStaffRole(role.with({'orderInRota': ev.target.value}))}/>
                <select disabled={!isEditingRole} value={role.type} onChange={ev => this.updateStaffRole(role.with({type: ev.target.value}))}>
                    <option value='bar'>Bar</option>
                    <option value='kitchen'>Kitchen</option>
                </select>
                {!isEditingRole && !this.props.staffRolesLocalState.isEditing() &&
                <button type='button' onClick={() => this.updateStaffRole(role)}>Edit</button>}
                {isEditingRole && <button type='button' onClick={() => this.saveStaffRole(role)}>Save</button>}
                {isEditingRole && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
              </div>
            )
          }
        )}
      </div>
    )
  }

  private updateStaffRole(staffRole: StaffRole) {
    this.props.updateStaffRole(this.props.staffRolesLocalState.with([staffRole], staffRole.id));
  }

  private cancelEdit() {
    this.props.updateStaffRole(this.props.staffRolesLocalState.with(this.props.staffRolesExternalState.externalState.roles));
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