import * as React from "react";
import {connect} from "react-redux";
import {StaffMemberStatus} from "../../Enum/StaffMemberStatus";
import {AppState} from "../../redux";
import {validateCash} from "../../Util/Validation";
import {StaffMember} from "../Rota/State/StaffMember";
import {StaffRolesExternalState} from "../StaffRoles/State/StaffRolesExternalState";
import {staffRolesFetch} from "../StaffRoles/State/StaffRolesRedux";
import "./StaffMembers.scss";
import {StaffMemberFilters} from "./State/StaffMemberFilters";
import {StaffMembersExternalState} from "./State/StaffMembersExternalState";
import {StaffMembersLocalState} from "./State/StaffMembersLocalState";
import {
  staffMembersCreate,
  staffMembersDataEntry,
  staffMembersFetch,
  staffMembersFilter
} from "./State/StaffMembersRedux";

interface StaffMembersOwnProps {
}

interface StaffMembersStateProps {
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffMemberFilters: StaffMemberFilters;
  staffRolesExternalState: StaffRolesExternalState;
}

const mapStateToProps = (state: AppState, ownProps: StaffMembersOwnProps): StaffMembersStateProps => {
  return {
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffMemberFilters: state.staffMemberFilters,
    staffRolesExternalState: state.staffRolesExternalState,
  }
};

interface StaffMembersDispatchProps {
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  setFilters: (filters: StaffMemberFilters) => void;
  saveStaffMember: (staffMember: StaffMember) => void;
  updateStaffMember: (staffMembersLocalState: StaffMembersLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: StaffMembersOwnProps): StaffMembersDispatchProps => {
  return {
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    setFilters: filters => dispatch(staffMembersFilter(filters)),
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
    const isCreatingNewMember = this.props.staffMembersLocalState.isCreatingMember;
    const newMember = this.props.staffMembersLocalState.newMember;
    const filteredMembers = this.props.staffMembersLocalState.members
      .filter(member => !this.props.staffMemberFilters.statusFiltered || member.status === this.props.staffMemberFilters.status);
    const lastPageNumber = Math.max(1,Math.ceil(filteredMembers.length/this.props.staffMemberFilters.pageSize));
    return (
      <div className="staff-members-data-entry">
        <div className="staff-members-filters">
          <div className="staff-members-filter">
            <div className="filter-group">
              <label>Page {this.props.staffMemberFilters.pageNumber}/{lastPageNumber}</label>
              <input type="number" step={1} min={1} max={lastPageNumber} value={this.props.staffMemberFilters.pageNumber} onChange={ev => this.props.setFilters(this.props.staffMemberFilters.with({pageNumber: parseInt(ev.target.value, 10)}))} />
            </div>
            <div className="filter-group">
              <label>Page size</label>
              <select value={this.props.staffMemberFilters.pageSize} onChange={ev => this.props.setFilters(this.props.staffMemberFilters.with({pageSize: parseInt(ev.target.value, 10), pageNumber: this.pageNumberForNewPageSize(parseInt(ev.target.value, 10))}))}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="filter-spacer"/>
          <div className="staff-members-filter">
            <div className="filter-group">
              <label>Filter by status?</label>
              <input type="checkbox" checked={this.props.staffMemberFilters.statusFiltered} onChange={ev => this.props.setFilters(this.props.staffMemberFilters.with({statusFiltered: ev.target.checked}))} />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select value={this.props.staffMemberFilters.status} onChange={ev => this.props.setFilters(this.props.staffMemberFilters.with({status: ev.target.value}))}>
                <option value={StaffMemberStatus.ACTIVE}>{StaffMemberStatus.ACTIVE}</option>
                <option value={StaffMemberStatus.INACTIVE}>{StaffMemberStatus.INACTIVE}</option>
                <option value={StaffMemberStatus.IMPORTED}>{StaffMemberStatus.IMPORTED}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="staff-member-entity title">
          <div>Name</div>
          <div>Status</div>
          <div>Current hourly rate</div>
          <div>Role</div>
        </div>
        {filteredMembers
          .slice(this.props.staffMemberFilters.pageSize * (this.props.staffMemberFilters.pageNumber - 1), this.props.staffMemberFilters.pageSize * this.props.staffMemberFilters.pageNumber)
          .map((member, key) => {
          const isEditingMember = !isCreatingNewMember && member.id === this.props.staffMembersLocalState.editingMemberId;
          return (
            <div className="staff-member-entity" key={key}>
              <input disabled={!isEditingMember} value={member.name} onChange={ev => this.updateStaffMember(member.with({'name' : ev.target.value}))} />
              <select disabled={!isEditingMember} value={member.status} onChange={ev => this.updateStaffMember(member.with({'status' : ev.target.value}))} >
                <option value={StaffMemberStatus.ACTIVE}>Active</option>
                <option value={StaffMemberStatus.INACTIVE}>Inactive</option>
                <option value={StaffMemberStatus.IMPORTED}>(imported)</option>
              </select>
              <input disabled={!isEditingMember} type='number' value={member.currentHourlyRate} onChange={ev => this.updateStaffMember(member.with({'currentHourlyRate' : validateCash(ev.target.value, member.currentHourlyRate)}))} />
              <select disabled={!isEditingMember} value={member.role.id} onChange={ev => this.updateStaffMember(member.with({role: this.props.staffRolesExternalState.externalState.roles.find(v => v.id.toString() === ev.target.value)}))}>
                {this.props.staffRolesExternalState.externalState.roles.map((role, roleKey) => (
                    <option key={roleKey} value={role.id}>{role.role}</option>
                  ))}
              </select>
              <div className="staff-member-edit-buttons">
                {!isCreatingNewMember && !isEditingMember && !this.props.staffMembersLocalState.isEditing() &&
                <button type='button' onClick={() => this.updateStaffMember(member)}>Edit</button>}
                {isEditingMember && <button type='button' onClick={() => this.saveStaffMember(member)}>Save</button>}
                {isEditingMember && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
              </div>
            </div>
          );
        })}
        <div className="staff-member-entity">
          {isCreatingNewMember && <input value={newMember.name} onChange={ev => this.newStaffMember(newMember.with({'name': ev.target.value}))}/>}
          {isCreatingNewMember && <input value={newMember.status} onChange={ev => this.newStaffMember(newMember.with({'status': ev.target.value}))}/>}
          {isCreatingNewMember && <input type='number' value={newMember.currentHourlyRate} onChange={ev => this.newStaffMember(newMember.with({'currentHourlyRate' : validateCash(ev.target.value, newMember.currentHourlyRate)}))}/>}
          {isCreatingNewMember &&
          <select value={newMember.role.id} onChange={ev => this.newStaffMember(newMember.with({role: this.props.staffRolesExternalState.externalState.roles.find(v => v.id.toString() === ev.target.value)}))}>
            {this.props.staffRolesExternalState.externalState.roles.map((role, roleKey) => (
              <option key={roleKey} value={role.id}>{role.role}</option>
            ))}
          </select>}
          <div className="staff-member-edit-buttons">
            {!isCreatingNewMember && !this.props.staffMembersLocalState.isEditing() &&
            <button type='button' onClick={() => this.newStaffMember()}>New</button>}
            {isCreatingNewMember && <button type='button' onClick={() => this.saveStaffMember(newMember)}>Save</button>}
            {isCreatingNewMember && <button type='button' onClick={() => this.cancelEdit()}>Cancel</button>}
          </div>
        </div>
      </div>
    )
  }
  
  private newStaffMember(staffMember: StaffMember = StaffMember.default()) {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withNewMember(staffMember));
  }

  private updateStaffMember(staffMember: StaffMember) {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withMembers([staffMember], staffMember.id));
  }

  private cancelEdit() {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withMembers(this.props.staffMembersExternalState.externalState.members));
  }

  private saveStaffMember(staffMember: StaffMember) {
    this.props.saveStaffMember(staffMember);
  }

  private pageNumberForNewPageSize(pageSize: number) {
    return Math.ceil(((this.props.staffMemberFilters.pageNumber-1)*this.props.staffMemberFilters.pageSize+1)/pageSize);
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