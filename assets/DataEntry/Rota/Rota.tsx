import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {match, Prompt} from "react-router";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {RotaStatus} from "../../Enum/RotaStatus";
import {AppState} from "../../redux";
import {uiUpdate} from "../../State/UiRedux";
import {UiState} from "../../State/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateAndTime} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import {ConstantsExternalState} from "../Constants/State/ConstantsExternalState";
import {constantsFetch} from "../Constants/State/ConstantsRedux";
import {StaffMembersExternalState} from "../StaffMembers/State/StaffMembersExternalState";
import {StaffMembersLocalState} from "../StaffMembers/State/StaffMembersLocalState";
import {staffMembersFetch} from "../StaffMembers/State/StaffMembersRedux";
import {StaffRolesExternalState} from "../StaffRoles/State/StaffRolesExternalState";
import {StaffRolesLocalState} from "../StaffRoles/State/StaffRolesLocalState";
import {staffRolesFetch} from "../StaffRoles/State/StaffRolesRedux";
import './Rota.scss';
import {Constants} from "./State/Constants";
import {RotaEntity} from "./State/RotaEntity";
import {RotaExternalState} from "./State/RotaExternalState";
import {rotaCreate, rotaDataEntry, rotaFetch} from "./State/RotaRedux";
import {RotasForWeek} from "./State/RotasForWeek";
import {Shift} from "./State/Shift";
import {StaffMember} from "./State/StaffMember";
import {StaffRole} from "./State/StaffRole";

interface RotaOwnProps {
  match: match<{
    date: string,
    type: string,
  }>;
}

interface RotaStateProps {
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
  uiState: UiState;
}

const mapStateToProps = (state: AppState, ownProps: RotaOwnProps): RotaStateProps => {
  return {
    constantsExternalState: state.constantsExternalState,
    rotaExternalState: state.rotaExternalState,
    rotaLocalStates: state.rotaLocalStates,
    staffMembersExternalState: state.staffMembersExternalState,
    staffMembersLocalState: state.staffMembersLocalState,
    staffRolesExternalState: state.staffRolesExternalState,
    staffRolesLocalState: state.staffRolesLocalState,
    uiState: state.uiState,
  }
};

interface RotaDispatchProps {
  createRota: (rota: RotaEntity) => void;
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

const mapDispatchToProps = (dispatch: any, ownProps: RotaOwnProps): RotaDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    fetchConstants: () => dispatch(constantsFetch()),
    fetchRotaForDate: (date: moment.Moment) => dispatch(rotaFetch(date)),
    fetchStaffMembers: () => dispatch(staffMembersFetch()),
    fetchStaffRoles: () => dispatch(staffRolesFetch()),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

type RotaProps = RotaOwnProps & RotaStateProps & RotaDispatchProps;

class RotaComponent extends React.Component<RotaProps, {}> {
  private DAY_START_HOUR = 6;

  public componentDidMount() {
    this.maintainStateWithUrl();
  }

  public componentDidUpdate() {
    this.maintainStateWithUrl();
  }

  public render() {
    const today = moment.utc(this.props.match.params.date);
    const startTime = momentFromDateAndTime(this.props.match.params.date, `0${this.DAY_START_HOUR}:00`);
    const endTime = momentFromDateAndTime(this.props.match.params.date, `0${this.DAY_START_HOUR}:00`).add(1, 'day');
    const numberOfTimePeriods = endTime.diff(startTime, 'minutes') / 30;
    const timePeriods: moment.Moment[] = [];
    for (let i=0; i<numberOfTimePeriods; i++) {
      timePeriods.push(startTime.clone().add(i*30, 'minutes'));
    }
    const unusedMembers = this.props.staffMembersLocalState.entities
      .filter(
      (member: StaffMember) => member.isActive() && this.getRota().plannedShifts.filter(
        shift => shift.staffMember.id === member.id
      ).length === 0
    );
    const visibleRoles: StaffRole[] = [];
    this.props.staffMembersLocalState.entities.forEach(member => {
      if (member.role.type === this.props.match.params.type && member.isActive() && visibleRoles.find(role => member.role.entityId === role.entityId) === undefined) {
        visibleRoles.push(member.role);
      }
    });
    const sortedRoles = visibleRoles.sort((a, b) => a.orderInRota > b.orderInRota ? 1 : -1);
    const editingDisabled = !this.getRota().canEditRota();
    if (!this.props.staffRolesExternalState.isLoaded()
      || !this.getRota()
      || !this.props.staffMembersExternalState.isLoaded()) {
      return null;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.constantsExternalState.externalState.entities.length === 0) {
      return (<div>No constants found. Cannot create a rota without constants.</div>)
    }
    return (
      <div>
        <h1 className="rota-title">{this.props.match.params.type} Rota {this.getRota().getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.match.params.date} urlFromDate={(date: moment.Moment) => Routes.rotaUrl(date, this.props.match.params.type)}/>
        <div className="rota-overview">
          <div className="rota-stat">
            Status:
            <select value={this.getRota().status} onChange={ev => this.formUpdate({status: ev.target.value})}>
              <option value={RotaStatus.NEW}>New</option>
              <option value={RotaStatus.DRAFT}>Draft</option>
              <option value={RotaStatus.ROTA_COMPLETE}>Rota Complete</option>
              <option value={RotaStatus.SIGN_IN_COMPLETE}>Sign In Complete</option>
              <option value={RotaStatus.IMPORTED}>Imported</option>
            </select>
            </div>
          <div className="rota-stat">Constants: {this.getRota().constants.date.format(DateFormats.API)}</div>
          <div className="rota-stat">Forecast revenue: {this.getRota().forecastRevenue}</div>
          <div className="rota-stat">Total wage cost: {Formatting.formatCash(this.getRota().getTotalPredictedLabourCost(this.props.rotaLocalStates.getTotalForecastRevenue(today), this.props.match.params.type))}</div>
          <div className="rota-stat">Labour rate: {Formatting.formatPercent(this.getRota().getPredictedLabourRate(this.props.rotaLocalStates.getTotalForecastRevenue(today), this.props.match.params.type))} (aiming for &lt; {Formatting.formatPercent(this.getRota().targetLabourRate)})</div>
          <div className="rota-stat"><button type="button" onClick={() => this.props.createRota(this.getRota())}><FontAwesomeIcon icon="save" /> Save</button></div>
        </div>
        <div className="rota-grid">
          <div className="rota-times">
            <div className="rota-header rota-staff-name">Name</div>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-start-time">Start</div>
            <div className="rota-header rota-end-time">End</div>
            <div className="rota-header rota-breaks">Breaks</div>
            {timePeriods.map((timePeriod, timeKey) => (
              <div className="rota-time" key={timeKey}>{timePeriod.minutes() === 0 && timePeriod.format(DateFormats.TIME_NO_LEADING_ZERO)}</div>
            ))}
          </div>
          <Prompt when={this.getRota().touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
          {sortedRoles.map((role, roleKey) => {
            const shifts = this.getRota().plannedShifts
              .filter(plannedShift => plannedShift.staffRole.id === role.id && plannedShift.type === this.props.match.params.type);
            if (shifts.length > 0 || !editingDisabled) {
              return (
                <div className="rota-role-group" key={roleKey}>
                  <div className="rota-role-header">{role.role}</div>
                  {shifts.map((plannedShift, shiftKey) => (
                    <div className="rota-shift" key={shiftKey}>
                      <div className="rota-staff-name">{plannedShift.staffMember.name}</div>
                      <div className="rota-remove-shift">
                        {!editingDisabled && <button className="rota-remove-shift-button" type='button'
                                                     onClick={() => this.removePlannedShift(plannedShift)}>
                          <FontAwesomeIcon icon="trash"/></button>}
                      </div>
                      <div className="rota-start-time">
                        {editingDisabled ? (
                          <div>{plannedShift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                        ) : (
                          <input disabled={editingDisabled} type='time' className="rota-time-input"
                                 value={plannedShift.startTimeInputValue}
                                 onChange={ev => this.startTimeHandler(ev.target.value, plannedShift)}
                          />
                        )}
                      </div>
                      <div className="rota-end-time">
                        {editingDisabled ? (
                          <div>{plannedShift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                        ) : (
                          <input type='time' className="rota-time-input"
                                 value={plannedShift.endTimeInputValue}
                                 onChange={ev => this.endTimeHandler(ev.target.value, plannedShift)}
                          />
                        )}
                      </div>
                      <div className="rota-breaks">{plannedShift.totalBreaks * 60} mins</div>
                      {timePeriods.map((timePeriod, periodKey) => (
                        <div
                          className={plannedShift.isWorkingAtTime(timePeriod) ? "rota-time working" : "rota-time"}
                          key={periodKey}/>
                      ))}
                    </div>
                  ))}
                  <div className="rota-horizontal-spacer"/>
                  {!editingDisabled && unusedMembers
                    .filter(member => member.role.id === role.id)
                    .map((member, shiftKey) => (
                      <div className="rota-shift no-shift" key={shiftKey}>
                        <div className="rota-staff-name">{member.name}</div>
                        <div className="rota-remove-shift"/>
                        <div className="rota-new-shift">
                          <button onClick={() => this.newShiftHandler(member)} type="button"><FontAwesomeIcon
                            icon="plus-circle"/></button>
                        </div>
                        <div className="rota-new-shift-spacer"/>
                        <div className="rota-new-shift-spacer"/>
                        {timePeriods.map((timePeriod, periodKey) => (
                          <div className="rota-time" key={periodKey}/>
                        ))}
                      </div>
                    ))}
                </div>);
            }
            return null;
            }
          )}
        </div>
      </div>)
  }

  private getRota(): RotaEntity {
    const localState = this.props.rotaLocalStates.getRotaForDate(moment.utc(this.props.match.params.date));
    return localState === undefined ? RotaEntity.default() : localState;
  }

  private formUpdate(obj: {}, touched: boolean = true) {
    if (touched) {
      this.props.updateRotaLocalState(
        [this.getRota().touchedWith(obj)]
      );
    } else {
      this.props.updateRotaLocalState(
        [this.getRota().with(obj)]
      );
    }
  }

  private newShiftHandler(member: StaffMember) {
    this.addPlannedShift(Shift.default().with({type: this.props.match.params.type, date: this.getRota().date, staffMember: member, staffRole: member.role, hourlyRate: member.currentHourlyRate}));
  }

  private startTimeHandler(value: string, plannedShift: Shift) {
    let time = momentFromDateAndTime(plannedShift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time = momentFromDateAndTime(plannedShift.date, '06:00');
      value = time.format('HH:mm');
    }
    const formattedTime = time.format('HH:mm');
    if (time.isSameOrAfter(plannedShift.getEndTime())) {
      this.updatePlannedShift(plannedShift.with({startTimeInputValue: value, startTime: formattedTime, endTimeInputValue: formattedTime, endTime: formattedTime, totalBreaks: this.getExpectedBreaks(time, plannedShift.getEndTime())}));
    } else {
      this.updatePlannedShift(plannedShift.with({startTimeInputValue: value, startTime: formattedTime, totalBreaks: this.getExpectedBreaks(time, plannedShift.getEndTime())}));
    }
  }

  private endTimeHandler(value: string, plannedShift: Shift) {
    const time = momentFromDateAndTime(plannedShift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time.add(1, 'day');
    }
    const formattedTime = time.format('HH:mm');
    if (time.isSameOrBefore(plannedShift.getStartTime())) {
      this.updatePlannedShift(plannedShift.with({endTimeInputValue: value, endTime: formattedTime, startTimeInputValue: value, startTime: formattedTime, totalBreaks: this.getExpectedBreaks(plannedShift.getStartTime(), time)}));
    } else {
      this.updatePlannedShift(plannedShift.with({endTimeInputValue: value, endTime: formattedTime, totalBreaks: this.getExpectedBreaks(plannedShift.getStartTime(), time)}));
    }
  }

  private getExpectedBreaks(startTime: moment.Moment, endTime: moment.Moment): number {
    const hoursDifference = endTime.diff(startTime, "hours");
    if (hoursDifference > this.getRota().constants.hoursPerLongBreak) {
      return this.getRota().constants.longBreakDuration;
    }
    if (hoursDifference > this.getRota().constants.hoursPerShortBreak) {
      return this.getRota().constants.shortBreakDuration;
    }
    return 0;
  }

  private addPlannedShift(plannedShift: Shift) {
    const clonedPlannedShifts = this.getRota().plannedShifts.map(shift => shift.clone());
    clonedPlannedShifts.push(plannedShift);
    this.formUpdate({plannedShifts: clonedPlannedShifts});
  }

  private updatePlannedShift(plannedShift: Shift) {
    const clonedPlannedShifts = this.getRota().plannedShifts.map(shift => shift.staffMember.id === plannedShift.staffMember.id ? plannedShift : shift.clone());
    this.formUpdate({plannedShifts: clonedPlannedShifts});
  }

  private removePlannedShift(plannedShift: Shift) {
    const clonedPlannedShifts = this.getRota().plannedShifts
      .filter(shift => shift.staffMember.id !== plannedShift.staffMember.id)
      .map(shift => shift.clone());
    this.formUpdate({plannedShifts: clonedPlannedShifts});
  }

  private maintainStateWithUrl() {
    const paramDate = moment.utc(this.props.match.params.date);
    if (this.props.uiState.isCurrentDateSameAs(paramDate)) {
      this.props.updateUi(this.props.uiState.withCurrentDate(paramDate));
      return;
    }
    if (this.props.staffRolesExternalState.isEmpty()) {
      this.props.fetchStaffRoles();
      return;
    }
    if (this.props.staffMembersExternalState.isEmpty()) {
      this.props.fetchStaffMembers();
      return;
    }
    if (this.props.constantsExternalState.isEmpty()) {
      this.props.fetchConstants();
      return;
    }
    if (this.props.rotaExternalState.shouldLoadForDate(paramDate)) {
      this.props.fetchRotaForDate(moment.utc(paramDate));
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.constantsExternalState.externalState.entities.length === 0) {
      return;
    }
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded() && !this.getRota().constants.id && this.props.constantsExternalState.externalState) {
      this.formUpdate({type: this.props.match.params.type, constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}, false);
    }
  }
}

export const Rota = connect<RotaStateProps, RotaDispatchProps, RotaOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaComponent);