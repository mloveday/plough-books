import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match} from "react-router";
import {Link} from "react-router-dom";
import {EditButton} from "../../Common/Buttons/EditButton";
import {NewButton} from "../../Common/Buttons/NewButton";
import {ResetButton} from "../../Common/Buttons/ResetButton";
import {SaveButton} from "../../Common/Buttons/SaveButton";
import {Routes} from "../../Common/Routing/Routes";
import {
  HOL_DR_ALL,
  HOL_DR_CURRENT,
  HOL_DR_FUTURE,
  HOL_DR_PAST,
  HolidayDateRanges
} from "../../Model/Enum/HolidayFilters";
import {Holiday} from "../../Model/Holiday/Holiday";
import {AppState} from "../../redux";
import {HolidayExternalState} from "../../Redux/Holiday/HolidayExternalState";
import {HolidayLocalState} from "../../Redux/Holiday/HolidayLocalState";
import {holidayCreate, holidayDataEntry, holidaysFetch} from "../../Redux/Holiday/HolidayRedux";
import {StaffMembersExternalState} from "../../Redux/StaffMember/StaffMembersExternalState";
import {staffMembersFetch} from "../../Redux/StaffMember/StaffMembersRedux";
import {DateFormats} from "../../Util/DateFormats";
import "./Holidays.scss";

interface HolidayDataEntryOwnProps {
  match: match<{
    dateRange?: HolidayDateRanges;
  }>
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
    const today = moment.utc().startOf('day');
    const isCreatingNewEntity = this.props.holidayLocalState.isCreatingEntity;
    const newEntity = this.props.holidayLocalState.newEntity;
    const staffMembers = this.props.staffMembersState.externalState.entities
      .filter(sm => sm.isActive());
    return (
      <div className="holiday-data-entry">
        <div className={`holiday-filters`}>
          <ul className={`filter-by-date-range`}>
            <li className={`date-range-item${this.props.match.params.dateRange === HOL_DR_ALL ? ' selected' : ''}`}><Link className={`date-range-link`} to={Routes.holidayUrl(HOL_DR_ALL)}>All</Link></li>
            <li className={`date-range-item${this.props.match.params.dateRange === HOL_DR_PAST ? ' selected' : ''}`}><Link className={`date-range-link`} to={Routes.holidayUrl(HOL_DR_PAST)}>Past</Link></li>
            <li className={`date-range-item${this.props.match.params.dateRange === HOL_DR_CURRENT ? ' selected' : ''}`}><Link className={`date-range-link`} to={Routes.holidayUrl(HOL_DR_CURRENT)}>Current</Link></li>
            <li className={`date-range-item${this.props.match.params.dateRange === HOL_DR_FUTURE ? ' selected' : ''}`}><Link className={`date-range-link`} to={Routes.holidayUrl(HOL_DR_FUTURE)}>Future</Link></li>
          </ul>
        </div>
        <div className="holiday-entity title">
          <div>Staff member</div>
          <div>Start Date</div>
          <div>End Date</div>
        </div>
        {this.props.holidayLocalState.entities
          .filter(hol => {
            switch (this.props.match.params.dateRange) {
              case HOL_DR_FUTURE:
                return today.format(DateFormats.API_DATE) !== hol.endDate && today.isBefore(hol.endDate, 'day');
              case HOL_DR_PAST:
                return today.format(DateFormats.API_DATE) !== hol.endDate && today.isAfter(hol.endDate, 'day');
              case HOL_DR_CURRENT:
                return today.format(DateFormats.API_DATE) === hol.startDate || today.format(DateFormats.API_DATE) === hol.endDate || today.isBetween(hol.startDate, hol.endDate, 'day', '[]');
              default:
                return true;
            }
          })
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
              {staffMembers.map(staffMember =>
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