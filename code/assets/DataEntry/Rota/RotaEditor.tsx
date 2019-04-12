import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {connect} from "react-redux";
import {Prompt} from "react-router";
import {DatePicker} from "../../Common/Nav/DatePicker";
import {Routes} from "../../Common/Routing/Routes";
import {RotaStatus} from "../../Model/Enum/RotaStatus";
import {WorkTypes} from "../../Model/Enum/WorkTypes";
import {RotaEntity} from "../../Model/Rota/RotaEntity";
import {RotasForWeek} from "../../Model/Rota/RotasForWeek";
import {RotaUpdateType} from "../../Model/Rota/RotaTypes";
import {Shift} from "../../Model/Shift/Shift";
import {StaffMember} from "../../Model/StaffMember/StaffMember";
import {StaffRole} from "../../Model/StaffRole/StaffRole";
import {AppState} from "../../redux";
import {rotaCreate, rotaDataEntry} from "../../Redux/Rota/RotaRedux";
import {uiUpdate} from "../../Redux/UI/UiRedux";
import {UiState} from "../../Redux/UI/UiState";
import {DateFormats} from "../../Util/DateFormats";
import {momentFromDateAndTime} from "../../Util/DateUtils";
import {Formatting} from "../../Util/Formatting";
import './Rota.scss';

export interface RotaEditorOwnProps {
  rota: RotaEntity;
  editType: 'rota'|'sign-in';
  workType: WorkTypes;
  date: string;
  staffMembers: StaffMember[];
  shifts: Shift[];
  title: string;
  showStats: boolean;
  showStaffLevels: boolean;
  rotasForWeek: RotasForWeek;
  addShift(shiftToAdd: Shift): void;
  updateShift(shiftToUpdate: Shift): void;
  removeShift(shiftToRemove: Shift): void;
}

export interface RotaEditorStateProps {}

export const mapStateToProps = (state: AppState, ownProps: RotaEditorOwnProps): RotaEditorStateProps => {
  return {}
};

export interface RotaEditorDispatchProps {
  createRota: (rota: RotaEntity) => void;
  updateRotaLocalState: (state: RotaEntity[]) => void;
  updateUi: (state: UiState) => void;
}

export const mapDispatchToProps = (dispatch: any, ownProps: RotaEditorOwnProps): RotaEditorDispatchProps => {
  return {
    createRota: (rota: RotaEntity) => dispatch(rotaCreate(rota)),
    updateRotaLocalState: (state: RotaEntity[]) => dispatch(rotaDataEntry(state)),
    updateUi: (state: UiState) => dispatch(uiUpdate(state)),
  };
};

export type RotaEditorProps = RotaEditorOwnProps & RotaEditorStateProps & RotaEditorDispatchProps;

export class RotaEditorComponent extends React.Component<RotaEditorProps, {}> {
  private DAY_START_HOUR = 6;

  public render() {
    const today = moment.utc(this.props.date);
    const timePeriods = this.getTimePeriods();
    const editingDisabled = !((this.props.editType === 'rota' && this.props.rota.canEditRota()) || (this.props.editType === 'sign-in' && this.props.rota.canEditSignIn()));
    return (
      <div>
        <h1 className="rota-title">{this.props.workType} {this.props.title} {this.props.rota.getDate().format(DateFormats.READABLE_WITH_YEAR)}</h1>
        <DatePicker dateParam={this.props.date} urlFromDate={(date: moment.Moment) => Routes.rotaUrl(date, this.props.workType)}/>
        <div className="rota-overview">
          <div className="rota-stat">
            Status:
            <select value={this.props.rota.status} onChange={ev => this.formUpdate({status: ev.target.value as RotaStatus})}>
              <option value={RotaStatus.NEW}>New</option>
              <option value={RotaStatus.DRAFT}>Draft</option>
              <option value={RotaStatus.ROTA_COMPLETE}>Rota Complete</option>
              <option value={RotaStatus.SIGN_IN_COMPLETE}>Sign In Complete</option>
              <option value={RotaStatus.IMPORTED}>Imported</option>
            </select>
            </div>
          {this.props.showStats && <div className="rota-stat">Constants: {moment.utc(this.props.rota.constants.date).format(DateFormats.API_DATE)}</div>}
          {this.props.showStats && <div className="rota-stat">Forecast revenue: {this.props.rota.forecastRevenue}</div>}
          {this.props.showStats && <div className="rota-stat">Total wage cost: {Formatting.formatCash(this.props.rota.getTotalPredictedLabourCost(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))}</div>}
          {this.props.showStats && <div className="rota-stat">Labour rate: {Formatting.formatPercent(this.props.rota.getPredictedLabourRate(this.props.rotasForWeek.getTotalForecastRevenue(today), this.props.workType))} (aiming for &lt; {Formatting.formatPercent(this.props.rota.targetLabourRate)})</div>}
          {this.props.editType === "sign-in" && <div className="rota-stat"><button disabled={editingDisabled} type="button" onClick={() => this.autoPopulateShifts()}><FontAwesomeIcon icon="magic" /> Auto-populate</button></div>}
          <div className="rota-stat"><button type="button" onClick={() => this.props.createRota(this.props.rota)}><FontAwesomeIcon icon="save" /> Save</button></div>
        </div>
        <div className="rota-grid include-times">
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
          {this.props.showStaffLevels && <div className="rota-staff-levels">
            <div className="rota-header rota-staff-name"/>
            <div className="rota-header rota-remove-shift"/>
            <div className="rota-header rota-start-time"/>
            <div className="rota-header rota-end-time"/>
            <div className="rota-header rota-breaks"/>
            {timePeriods.map((timePeriod, timeKey) => {
              const numberWorking = this.props.rota.getPlannedNumberWorkingAtTime(timePeriod.format(DateFormats.TIME_LEADING_ZERO), this.props.workType);
              const numberRequired = (this.props.workType === WorkTypes.BAR ? this.props.rota.barRotaTemplate : this.props.rota.kitchenRotaTemplate).staffRequired(timeKey);
              const numberLeft = numberRequired - numberWorking;
              const stylingClass = numberLeft <= 0 ? 'staff-good' : (numberLeft === 1 ? 'staff-ok' : (numberLeft === 2 ? 'staff-mediocre' : 'staff-poor'));
              return <div className={`rota-time ${stylingClass}`} key={timeKey}>{numberLeft}</div>
            })}
          </div>}
          <Prompt when={this.props.rota.touched} message={location => `Are you sure you want to go to ${location.pathname} without saving?`}/>
          {this.getRolesToDisplay().map((role, roleKey) =>
            <div className="rota-role-group" key={roleKey}>
              <div className="rota-role-header">{role.role}</div>
              {this.props.staffMembers
                .filter(staffMember => staffMember.role.id === role.id)
                .map((staffMember, key) => this.getShiftForStaffMember(staffMember, timePeriods, editingDisabled, key))
              }
            </div>
            )}
        </div>
      </div>
    );
  }

  private getRolesToDisplay() {
    const visibleRoles: StaffRole[] = [];
    this.props.staffMembers.forEach(member => {
      if (member.role.type === this.props.workType && member.isActive() && visibleRoles.find(role => member.role.entityId === role.entityId) === undefined) {
        visibleRoles.push(member.role);
      }
    });
    return visibleRoles.sort((a, b) => a.orderInRota > b.orderInRota ? 1 : -1);
  }

  private getShiftForStaffMember(staffMember: StaffMember, timePeriods: moment.Moment[], editingDisabled: boolean, key: number) {
    const shift = this.props.shifts.find(s => s.staffMember.id === staffMember.id);
    return shift === undefined
      ? this.getEmptyShift(staffMember, timePeriods, key)
      : this.getShift(shift, timePeriods, editingDisabled, key);
  }

  private getEmptyShift(staffMember: StaffMember, timePeriods: moment.Moment[], key: number) {
    return (
      <div className="rota-shift no-shift" key={key}>
        <div className="rota-staff-name">{staffMember.name}</div>
        <div className="rota-remove-shift"/>
        <div className="rota-new-shift">
          <button onClick={() => this.newShiftHandler(staffMember)} type="button"><FontAwesomeIcon icon="plus-circle"/></button>
        </div>
        <div className="rota-new-shift-spacer"/>
        <div className="rota-new-shift-spacer"/>
        {timePeriods.map((timePeriod, periodKey) => (
          <div className="rota-time" key={periodKey}/>
        ))}
      </div>
    );
  }

  private getShift(shift: Shift, timePeriods: moment.Moment[], editingDisabled: boolean, key: number) {
    return (
      <div className="rota-shift" key={key}>
        <div className="rota-staff-name">{shift.staffMember.name}</div>
        <div className="rota-remove-shift">
          {!editingDisabled &&
          <button className="rota-remove-shift-button" type='button' onClick={() => this.props.removeShift(shift)}>
            <FontAwesomeIcon icon="trash"/>
          </button>}
        </div>
        <div className="rota-start-time">
          {editingDisabled ? (
            <div>{shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input disabled={editingDisabled}
                   type='time'
                   className="rota-time-input"
                   value={shift.inputs.startTime.time}
                   onChange={ev => this.startTimeHandler(ev.target.value, shift)}
            />
          )}
        </div>
        <div className="rota-end-time">
          {editingDisabled ? (
            <div>{shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input type='time'
                   className="rota-time-input"
                   value={shift.inputs.endTime.time}
                   onChange={ev => this.endTimeHandler(ev.target.value, shift)}
            />
          )}
        </div>
        <div className="rota-breaks">{shift.totalBreaks * 60} mins</div>
        {timePeriods.map((timePeriod, periodKey) => (
          <div className={shift.isWorkingAtTime(timePeriod) ? "rota-time working" : "rota-time"} key={periodKey}/>
        ))}
      </div>
    );
  }

  private getTimePeriods() {
    const startTime = momentFromDateAndTime(this.props.date, `0${this.DAY_START_HOUR}:00`);
    const endTime = momentFromDateAndTime(this.props.date, `0${this.DAY_START_HOUR}:00`).add(1, 'day');
    const numberOfTimePeriods = endTime.diff(startTime, 'minutes') / 30;
    const timePeriods: moment.Moment[] = [];
    for (let i = 0; i < numberOfTimePeriods; i++) {
      timePeriods.push(startTime.clone().add(i * 30, 'minutes'));
    }
    return timePeriods;
  }

  private formUpdate(obj: RotaUpdateType, touched: boolean = true) {
    if (touched) {
      this.props.updateRotaLocalState(
        [this.props.rota.updateTouched(obj)]
      );
    } else {
      this.props.updateRotaLocalState(
        [this.props.rota.update(obj)]
      );
    }
  }

  private newShiftHandler(member: StaffMember) {
    this.props.addShift(Shift.default(member, this.props.workType as WorkTypes, this.props.rota.date));
  }

  private startTimeHandler(value: string, shift: Shift) {
    let time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time = momentFromDateAndTime(shift.date, '06:00');
    }
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, endTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    } else {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    }
  }

  private endTimeHandler(value: string, shift: Shift) {
    const time = momentFromDateAndTime(shift.date, value);
    if (time.hour() < this.DAY_START_HOUR) {
      time.add(1, 'day');
    }
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.props.updateShift(shift.with({endTime: {date: shift.date, time: value}, startTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    } else {
      this.props.updateShift(shift.with({endTime: {date: shift.date, time: value}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    }
  }

  private getExpectedBreaks(startTime: moment.Moment, endTime: moment.Moment): number {
    const hoursDifference = endTime.diff(startTime, "hours");
    if (hoursDifference > this.props.rota.constants.hoursPerLongBreak) {
      return this.props.rota.constants.longBreakDuration;
    }
    if (hoursDifference > this.props.rota.constants.hoursPerShortBreak) {
      return this.props.rota.constants.shortBreakDuration;
    }
    return 0;
  }

  private autoPopulateShifts() {
    const clonedPlannedShifts = this.props.rota.plannedShifts.map(shift => shift.duplicate());
    this.formUpdate({actualShifts: clonedPlannedShifts});
  }
}

export const RotaEditor = connect<RotaEditorStateProps, RotaEditorDispatchProps, RotaEditorOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RotaEditorComponent);