import * as React from "react";
import {connect} from "react-redux";
import {EditButton} from "../../Common/Buttons/EditButton";
import {NewButton} from "../../Common/Buttons/NewButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {StaffMemberStatus} from "../../Model/Enum/StaffMemberStatus";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {AppState} from "../../redux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {StaffMembersLocalState} from "../../Redux/StaffMember/StaffMembersLocalState";
import {
  staffMembersCreate,
  staffMembersDataEntry,
  staffMembersFetch,
  staffMembersFilter
} from "../../Redux/StaffMember/StaffMembersRedux";
import {StaffRolesExternalState} from "../../Redux/StaffRole/StaffRolesExternalState";
import {staffRolesFetch} from "../../Redux/StaffRole/StaffRolesRedux";
import {currencyPattern} from "../../Util/Validation";
import "./StaffMembers.scss";
import {StaffMemberFilters} from "./State/StaffMemberFilters";

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
    const isCreatingNewMember = this.props.staffMembersLocalState.isCreatingEntity;
    const newMember = this.props.staffMembersLocalState.newEntity;
    const filteredMembers = this.props.staffMembersLocalState.entities
      .filter(member => member.entityId === this.props.staffMembersLocalState.editingEntityId || !this.props.staffMemberFilters.statusFiltered || member.status === this.props.staffMemberFilters.status);
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
              <select value={this.props.staffMemberFilters.status} onChange={ev => this.props.setFilters(this.props.staffMemberFilters.with({status: ev.target.value as StaffMemberStatus}))}>
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
          const isEditingMember = !isCreatingNewMember && member.id === this.props.staffMembersLocalState.editingEntityId;
          return (
            <div className="staff-member-entity" key={key}>
              <input disabled={!isEditingMember} value={member.name} onChange={ev => this.updateStaffMember(member.with({'name' : ev.target.value}))} />
              {member.status === StaffMemberStatus.IMPORTED && <div>{StaffMemberStatus.IMPORTED}</div>}
              {member.status !== StaffMemberStatus.IMPORTED && <select disabled={!isEditingMember} value={member.status} onChange={ev => this.updateStaffMember(member.with({'status' : ev.target.value}))} >
                <option value={StaffMemberStatus.ACTIVE}>Active</option>
                <option value={StaffMemberStatus.INACTIVE}>Inactive</option>
              </select>}
              <input disabled={!isEditingMember} type='text' pattern={currencyPattern} value={member.inputs.currentHourlyRate} onChange={ev => this.updateStaffMember(member.with({'currentHourlyRate' : ev.target.value}))} />
              <select disabled={!isEditingMember} value={member.role.id} onChange={ev => this.updateStaffMember(member.with({role: this.props.staffRolesExternalState.externalState.entities.find(v => v.entityId.toString() === ev.target.value)}))}>
                {this.props.staffRolesExternalState.externalState.entities.map((role, roleKey) => (
                    <option key={roleKey} value={role.id}>{role.role}</option>
                  ))}
              </select>
              <div className="staff-member-edit-buttons">
                {!isEditingMember && <EditButton disabled={isCreatingNewMember || this.props.staffMembersLocalState.isEditing()} mini={true} clickFn={() => this.updateStaffMember(member)}/>}
                {isEditingMember && <SaveButton mini={true} clickFn={() => this.saveStaffMember(member)}/>}
                {isEditingMember && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
              </div>
            </div>
          );
        })}
        <div className="staff-member-entity">
          {isCreatingNewMember && <input value={newMember.name} onChange={ev => this.newStaffMember(newMember.with({'name': ev.target.value}))}/>}
          {isCreatingNewMember && <select value={newMember.status} onChange={ev => this.newStaffMember(newMember.with({'status' : ev.target.value}))} >
              <option value={StaffMemberStatus.ACTIVE}>Active</option>
              <option value={StaffMemberStatus.INACTIVE}>Inactive</option>
          </select>}
          {isCreatingNewMember && <input type='text' pattern={currencyPattern} value={newMember.inputs.currentHourlyRate} onChange={ev => this.newStaffMember(newMember.with({'currentHourlyRate' : ev.target.value}))}/>}
          {isCreatingNewMember &&
          <select value={newMember.role.entityId} onChange={ev => this.newStaffMember(newMember.with({role: this.props.staffRolesExternalState.externalState.entities.find(v => v.entityId.toString() === ev.target.value)}))}>
            {!newMember.role.isValid() && <option value={undefined}>Choose a role...</option>}
            {this.props.staffRolesExternalState.externalState.entities.map((role, roleKey) => (
              <option key={roleKey} value={role.id}>{role.role}</option>
            ))}
          </select>}
          <div className="staff-member-edit-buttons">
            {!isCreatingNewMember && <NewButton disabled={this.props.staffMembersLocalState.isEditing()} mini={true} clickFn={() => this.newStaffMember()}/>}
            {isCreatingNewMember && <SaveButton disabled={!newMember.role.isValid()} mini={true} clickFn={() => this.saveStaffMember(newMember)}/>}
            {isCreatingNewMember && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
          </div>
        </div>
      </div>
    )
  }
  
  private newStaffMember(staffMember: StaffMember = StaffMember.default().with({role: this.props.staffRolesExternalState.externalState.entities.slice(0,1)[0]})) {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withNewEntity(staffMember));
  }

  private updateStaffMember(staffMember: StaffMember) {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withEntities([staffMember], staffMember.id));
  }

  private cancelEdit() {
    this.props.updateStaffMember(this.props.staffMembersLocalState.withEntities([]));
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