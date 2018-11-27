import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../../redux";
import {validateCash} from "../../Util/Validation";
import {StaffMember} from "../Rota/State/StaffMember";
import {StaffRolesExternalState} from "../StaffRoles/State/StaffRolesExternalState";
import {staffRolesFetch} from "../StaffRoles/State/StaffRolesRedux";
import {StaffMembersExternalState} from "./State/StaffMembersExternalState";
import {StaffMembersLocalState} from "./State/StaffMembersLocalState";
import {staffMembersCreate, staffMembersDataEntry, staffMembersFetch} from "./State/StaffMembersRedux";

interface StaffMembersOwnProps {
}

interface StaffMembersStateProps {
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
}

const mapStateToProps = (state: AppState, ownProps: StaffMembersOwnProps): StaffMembersStateProps => {
  return {
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffRolesExternalState: state.staffRolesExternalState,
  }
};

interface StaffMembersDispatchProps {
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  saveStaffMember: (staffMember: StaffMember) => void;
  updateStaffMember: (staffMembersLocalState: StaffMembersLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffMembersOwnProps): StaffMembersDispatchProps => {
  return {
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    saveStaffMember: (staffMember: StaffMember) => dispatch(staffMembersCreate(staffMember)),
    updateStaffMember: (staffMembersLocalState: StaffMembersLocalState) => dispatch(staffMembersDataEntry(staffMembersLocalState)),
  };
};

type StaffMembersProps = StaffMembersOwnProps & StaffMembersStateProps & StaffMembersDispatchProps;

class StaffMembersComponent extends React.Component<StaffMembersProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }
  
  public render() {
    return (
      <div>
        {this.props.staffMembersExternalState.externalState &&
          this.props.staffMembersLocalState.members.map((member, key) => {
            const isEditingMember = member.id === this.props.staffMembersLocalState.editingMemberId;
            return (
              <div key={key}>
                <input disabled={!isEditingMember} value={member.name} onChange={ev => this.updateStaffMember(member.with({'name' : ev.target.value}))} />
                <input disabled={!isEditingMember} value={member.status} onChange={ev => this.updateStaffMember(member.with({'status' : ev.target.value}))} />
                <input disabled={!isEditingMember} type='number' value={member.currentHourlyRate} onChange={ev => this.updateStaffMember(member.with({'currentHourlyRate' : validateCash(ev.target.value, member.currentHourlyRate)}))} />
                <select disabled={!isEditingMember} value={member.role.id} onChange={ev => this.updateStaffMember(member.with({role: this.props.staffRolesExternalState.externalState.roles.find(v => v.id.toString() === ev.target.value)}))}>
                  {this.props.staffRolesExternalState.externalState.roles.map((role, roleKey) => (
                      <option key={roleKey} value={role.id}>{role.role}</option>
                    ))}
                </select>
                {!isEditingMember && !this.props.staffMembersLocalState.isEditing() && <button type='button' onClick={() => this.updateStaffMember(member)}>Edit</button>}
                {isEditingMember && <button type='button' onClick={() => this.saveStaffMember(member)}>Save</button>}
                {isEditingMember && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
              </div>
            );})}
      </div>
    )
  }

  private updateStaffMember(staffMember: StaffMember) {
    this.props.updateStaffMember(this.props.staffMembersLocalState.with([staffMember], staffMember.id));
  }

  private cancelEdit() {
    this.props.updateStaffMember(this.props.staffMembersLocalState.with(this.props.staffMembersExternalState.externalState.members));
  }

  private saveStaffMember(staffMember: StaffMember) {
    this.props.saveStaffMember(staffMember);
  }

  private maintainStateWithUrl() {
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
    if (this.props.staffMembersExternalState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
  }
}

export const StaffMembers = connect<StaffMembersStateProps, StaffMembersDispatchProps, StaffMembersOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(StaffMembersComponent);