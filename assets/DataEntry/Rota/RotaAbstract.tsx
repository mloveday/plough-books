import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
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
import {Constants} from "../Constants/State/Constants";
import {RotaEntity} from "./State/RotaEntity";
import {RotaExternalState} from "./State/RotaExternalState";
import {rotaCreate, rotaDataEntry, rotaFetch} from "./State/RotaRedux";
import {RotasForWeek} from "./State/RotasForWeek";
import {Shift} from "./State/Shift";
import {StaffMember} from "../StaffMembers/State/StaffMember";
import {StaffRole} from "../StaffRoles/State/StaffRole";

export interface RotaAbstractOwnProps {
  match: match<{
    date: string,
    type: string,
  }>;
}

export interface RotaAbstractStateProps {
  constantsExternalState: ConstantsExternalState;
  rotaExternalState: RotaExternalState;
  rotaLocalStates: RotasForWeek;
  staffMembersExternalState: StaffMembersExternalState;
  staffMembersLocalState: StaffMembersLocalState;
  staffRolesExternalState: StaffRolesExternalState;
  staffRolesLocalState: StaffRolesLocalState;
  uiState: UiState;
}

export const mapStateToProps = (state: AppState, ownProps: RotaAbstractOwnProps): RotaAbstractStateProps => {
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

export interface RotaAbstractDispatchProps {
  createRota: (rota: RotaEntity) => void;
  fetchConstants: () => void;
  fetchRotaForDate: (date: moment.Moment) => void;
  fetchStaffMembers: () => void;
  fetchStaffRoles: () => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: RotaAbstractOwnProps): RotaAbstractDispatchProps => {
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

export type RotaAbstractProps = RotaAbstractOwnProps & RotaAbstractStateProps & RotaAbstractDispatchProps;

export abstract class RotaAbstractComponent extends React.Component<RotaAbstractProps, {}> {
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
      (member: StaffMember) => member.isActive() && this.getShifts().filter(
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
        <h1 className="rota-title">{this.props.match.params.type} {this.getName()} {this.getRota().getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
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
          {this.showStats() && <div className="rota-stat">Constants: {this.getRota().constants.date.format(DateFormats.API)}</div>}
          {this.showStats() && <div className="rota-stat">Forecast revenue: {this.getRota().forecastRevenue}</div>}
          {this.showStats() && <div className="rota-stat">Total wage cost: {Formatting.formatCash(this.getRota().getTotalPredictedLabourCost(this.props.rotaLocalStates.getTotalForecastRevenue(today), this.props.match.params.type))}</div>}
          {this.showStats() && <div className="rota-stat">Labour rate: {Formatting.formatPercent(this.getRota().getPredictedLabourRate(this.props.rotaLocalStates.getTotalForecastRevenue(today), this.props.match.params.type))} (aiming for &lt; {Formatting.formatPercent(this.getRota().targetLabourRate)})</div>}
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
            const shifts = this.getShifts()
              .filter(shift => shift.staffRole.id === role.id && shift.type === this.props.match.params.type);
            if (shifts.length > 0 || !editingDisabled) {
              return (
                <div className="rota-role-group" key={roleKey}>
                  <div className="rota-role-header">{role.role}</div>
                  {shifts.map((shift, shiftKey) => (
                    <div className="rota-shift" key={shiftKey}>
                      <div className="rota-staff-name">{shift.staffMember.name}</div>
                      <div className="rota-remove-shift">
                        {!editingDisabled && <button className="rota-remove-shift-button" type='button'
                                                     onClick={() => this.removeShift(shift)}>
                          <FontAwesomeIcon icon="trash"/></button>}
                      </div>
                      <div className="rota-start-time">
                        {editingDisabled ? (
                          <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                        ) : (
                          <input disabled={editingDisabled} type='time' className="rota-time-input"
                                 value={shift.startTimeInputValue}
                                 onChange={ev => this.startTimeHandler(ev.target.value, shift)}
                          />
                        )}
                      </div>
                      <div className="rota-end-time">
                        {editingDisabled ? (
                          <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
                        ) : (
                          <input type='time' className="rota-time-input"
                                 value={shift.endTimeInputValue}
                                 onChange={ev => this.endTimeHandler(ev.target.value, shift)}
                          />
                        )}
                      </div>
                      <div className="rota-breaks">{shift.totalBreaks * 60} mins</div>
                      {timePeriods.map((timePeriod, periodKey) => (
                        <div
                          className={shift.isWorkingAtTime(timePeriod) ? "rota-time working" : "rota-time"}
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

  protected abstract getName(): string;
  protected abstract showStats(): boolean;
  protected abstract getShifts(): Shift[];
  protected abstract addShift(shiftToAdd: Shift): void;
  protected abstract updateShift(shiftToUpdate: Shift): void;
  protected abstract removeShift(shiftToRemove: Shift): void;

  protected getRota(): RotaEntity {
    const date = moment.utc(this.props.match.params.date);
    const localState = this.props.rotaLocalStates.getRotaForDate(date);
    return localState === undefined ? RotaEntity.default(date) : localState;
  }

  protected formUpdate(obj: {}, touched: boolean = true) {
    if (touched) {
      this.props.updateRotaLocalState(
        [this.getRota().updateTouched(obj)]
      );
    } else {
      this.props.updateRotaLocalState(
        [this.getRota().update(obj)]
      );
    }
  }

  private newShiftHandler(member: StaffMember) {
    this.addShift(Shift.fromResponse({type: this.props.match.params.type, staffMember: member, staffRole: member.role, hourlyRate: member.currentHourlyRate}, this.getRota().date));
  }

  private startTimeHandler(value: string, shift: Shift) {
    let time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time = momentFromDateAndTime(shift.date, '06:00');
      value = time.format('HH:mm');
    }
    const formattedTime = time.format(`${DateFormats.API} HH:mm`);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.updateShift(shift.fromApi({startTimeInputValue: value, startTime: formattedTime, endTimeInputValue: formattedTime, endTime: formattedTime, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime())}));
    } else {
      this.updateShift(shift.fromApi({startTimeInputValue: value, startTime: formattedTime, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime())}));
    }
  }

  private endTimeHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time.add(1, 'day');
    }
    const formattedTime = time.format(`${DateFormats.API} HH:mm`);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.updateShift(shift.fromApi({endTimeInputValue: value, endTime: formattedTime, startTimeInputValue: value, startTime: formattedTime, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time)}));
    } else {
      this.updateShift(shift.fromApi({endTimeInputValue: value, endTime: formattedTime, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time)}));
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
    if (this.props.constantsExternalState.isLoaded() && this.props.rotaExternalState.isLoaded() && this.getRota().constants.id === undefined && this.props.constantsExternalState.externalState) {
      this.formUpdate({constants: this.props.constantsExternalState.externalState.entities.length > 0 ? this.props.constantsExternalState.externalState.entities.slice(0,1)[0] : Constants.default()}, false);
    }
  }
}