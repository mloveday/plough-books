import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {EditButton} from "../../Common/Buttons/EditButton";
import {NewButton} from "../../Common/Buttons/NewButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {Holiday} from "../../Model/Holiday/Holiday";
import {AppState} from "../../redux";
import {HolidayExternalState} from "../../Redux/Holiday/HolidayExternalState";
import {HolidayLocalState} from "../../Redux/Holiday/HolidayLocalState";
import {holidayCreate, holidayDataEntry, holidaysFetch} from "../../Redux/Holiday/HolidayRedux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {staffMembersFetch} from "../../Redux/StaffMember/StaffMembersRedux";
import "./Holidays.scss";

interface HolidayDataEntryOwnProps {
}

interface HolidayDataEntryStateProps {
  holidayExternalState: HolidayExternalState;
  holidayLocalState: HolidayLocalState;
  staffMembersState: StaffMembersExternalState;
}

const mapStateToProps = (state: AppState, ownProps: HolidayDataEntryOwnProps): HolidayDataEntryStateProps => {
  return {
    holidayExternalState: state.holidayExternalState,
    holidayLocalState: state.holidayLocalState,
    staffMembersState: state.staffMembersExternalState,
  }
};

interface HolidayDataEntryDispatchProps {
  fetchHolidays: () => void;
  fetchStaffMembers: () => void;
  saveHoliday: (holiday: Holiday) => void;
  updateHoliday: (holidayLocalState: HolidayLocalState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: HolidayDataEntryOwnProps): HolidayDataEntryDispatchProps => {
  return {
    fetchHolidays: () => dispatch(holidaysFetch()),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    saveHoliday: (holiday: Holiday) => dispatch(holidayCreate(holiday)),
    updateHoliday: (holidayLocalState: HolidayLocalState) => dispatch(holidayDataEntry(holidayLocalState)),
  };
};

type HolidayDataEntryProps = HolidayDataEntryOwnProps & HolidayDataEntryStateProps & HolidayDataEntryDispatchProps;

class HolidayDataEntryComponent extends React.Component<HolidayDataEntryProps, {}> {
  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }
  
  public render() {
    const isCreatingNewEntity = this.props.holidayLocalState.isCreatingEntity;
    const newEntity = this.props.holidayLocalState.newEntity;
    return (
      <div className="holiday-data-entry">
        <div className="holiday-entity title">
          <div>Staff member</div>
          <div>Start Date</div>
          <div>End Date</div>
        </div>
        {this.props.holidayLocalState.entities
          .map((entity, key) => {
          const isEditingEntity = !isCreatingNewEntity && entity.id === this.props.holidayLocalState.editingEntityId;
          const staffMember = this.props.staffMembersState.externalState.entities.find(s => s.id === entity.staffId);
          return (
            <div className="holiday-entity" key={key}>
              <div className="holiday-input-wrapper">{staffMember ? staffMember.name : 'loading...'}</div>
              <div className="holiday-input-wrapper"><input disabled={!isEditingEntity} type={`date`} value={entity.inputs.startDate} onChange={ev => this.updateStartDate(entity, ev.target.value)} /></div>
              <div className="holiday-input-wrapper"><input disabled={!isEditingEntity} type={`date`} value={entity.inputs.endDate} onChange={ev => this.updateEndDate(entity, ev.target.value)} /></div>
              <div className="holiday-edit-buttons">
                {!isEditingEntity && <EditButton disabled={isCreatingNewEntity || this.props.holidayLocalState.isEditing()} mini={true} clickFn={() => this.updateHoliday(entity)}/>}
                {isEditingEntity && <SaveButton mini={true} clickFn={() => this.saveHoliday(entity)}/>}
                {isEditingEntity && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
              </div>
            </div>
          );
        })}
        <div className="holiday-entity">
          {isCreatingNewEntity && [
            <select key={0} onChange={ev => this.updateNewHoliday(newEntity.with({staffId: parseInt(ev.target.value, 10)}))} value={newEntity.staffId}>
              {this.props.staffMembersState.externalState.entities.map(staffMember =>
                <option key={staffMember.id} value={staffMember.id}>{staffMember.name}</option>
              )}
            </select>,
            <div className="holiday-input-wrapper" key={1}><input type={`date`} value={newEntity.inputs.startDate} onChange={ev => this.updateNewStartDate(newEntity, ev.target.value)} /></div>,
            <div className="holiday-input-wrapper" key={2}><input type={`date`} value={newEntity.inputs.endDate} onChange={ev => this.updateNewEndDate(newEntity, ev.target.value)} /></div>,
            ]}
          
          <div className="holiday-edit-buttons">
            {!isCreatingNewEntity && <NewButton disabled={this.props.holidayLocalState.isEditing()} mini={true} clickFn={() => this.newHoliday()}/>}
            {isCreatingNewEntity && <SaveButton mini={true} clickFn={() => this.saveHoliday(newEntity)}/>}
            {isCreatingNewEntity && <ResetButton mini={true} clickFn={() => this.cancelEdit()}>Cancel</ResetButton>}
          </div>
        </div>
      </div>
    )
  }
  
  private newHoliday() {
    const staffMembers = this.props.staffMembersState.externalState.entities;
    if (staffMembers.length === 0) {
      return;
    }
    this.props.updateHoliday(this.props.holidayLocalState.withNewEntity(Holiday.defaultFor(staffMembers[0])));
  }

  private updateStartDate(holiday: Holiday, startDate: string) {
    if (moment.utc(startDate) > moment.utc(holiday.endDate)) {
      this.updateHoliday(holiday.with({startDate, endDate: startDate}));
    } else {
      this.updateHoliday(holiday.with({startDate}));
    }
  }

  private updateEndDate(holiday: Holiday, endDate: string) {
    if (moment.utc(endDate) < moment.utc(holiday.startDate)) {
      this.updateHoliday(holiday.with({startDate: endDate, endDate}));
    } else {
      this.updateHoliday(holiday.with({endDate}));
    }
  }

  private updateHoliday(holiday: Holiday) {
    this.props.updateHoliday(this.props.holidayLocalState.withEntities([holiday], holiday.id));
  }

  private updateNewStartDate(holiday: Holiday, startDate: string) {
    if (moment.utc(startDate) > moment.utc(holiday.endDate)) {
      this.updateNewHoliday(holiday.with({startDate, endDate: startDate}));
    } else {
      this.updateNewHoliday(holiday.with({startDate}));
    }
  }

  private updateNewEndDate(holiday: Holiday, endDate: string) {
    if (moment.utc(endDate) < moment.utc(holiday.startDate)) {
      this.updateNewHoliday(holiday.with({startDate: endDate, endDate}));
    } else {
      this.updateNewHoliday(holiday.with({endDate}));
    }
  }

  private updateNewHoliday(holiday: Holiday) {
    this.props.updateHoliday(this.props.holidayLocalState.withNewEntity(holiday));
  }

  private cancelEdit() {
    this.props.updateHoliday(this.props.holidayLocalState.withEntities(this.props.holidayExternalState.externalState.entities));
  }

  private saveHoliday(holiday: Holiday) {
    this.props.saveHoliday(holiday);
  }

  private maintainStateWithUrl() {
    if (this.props.holidayExternalState.isEmpty()) {
      this.props.fetchHolidays();
      return;
    }
    if (this.props.staffMembersState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
  }
}

export const HolidayDataEntry = connect<HolidayDataEntryStateProps, HolidayDataEntryDispatchProps, HolidayDataEntryOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HolidayDataEntryComponent);