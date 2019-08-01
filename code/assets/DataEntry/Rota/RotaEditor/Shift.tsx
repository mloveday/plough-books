import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as moment from "moment";
import * as React from "react";
import {Constants} from "../../../Model/Constants/Constants";
import {ShiftRecordingType, ShiftRecordingTypes} from "../../../Model/Enum/ShiftRecordingType";
import {WorkType, WorkTypes} from "../../../Model/Enum/WorkTypes";
import {Holiday} from "../../../Model/Holiday/Holiday";
import {Shift} from "../../../Model/Shift/Shift";
import {DateFormats} from "../../../Util/DateFormats";
import {
  getHalfHoursPastStartFromTime,
  getShiftEndTimeFromStrings,
  getShiftStartTimeFromStrings
} from "../../../Util/DateUtils";
import {currencyPattern} from "../../../Util/Validation";
import {DnDRotaTime} from "../DraggedRotaTime";

export interface ShiftOwnProps {
  shift: Shift;
  onHoliday: boolean;
  holiday?: Holiday;
  editingDisabled: boolean;
  constants: Constants;
  editType: ShiftRecordingType;
  workType: WorkType;
  rotaShowRates: boolean;
  timePeriods: moment.Moment[];
  updateShift: (shiftToUpdate: Shift) => void;
  removeShift: (shiftToRemove: Shift) => void;
}

export class ShiftComponent extends React.Component<ShiftOwnProps, {}> {
  public render() {
    const shiftStartIndex: number = getHalfHoursPastStartFromTime(this.props.shift.getStartTime());
    const shiftEndIndex: number = getHalfHoursPastStartFromTime(this.props.shift.getEndTime());
    return (
      <div className={`rota-shift ${this.props.shift.offFloor ? 'off-floor' : 'on-floor'}${this.props.onHoliday ? ' on-holiday':''}`} key={this.props.shift.staffMember.entityId}>
        <div className="rota-staff-name">{this.props.shift.staffMember.name}</div>
        <div className="rota-remove-shift">
          {!this.props.editingDisabled &&
          <button className="rota-remove-shift-button" type='button' onClick={() => this.props.removeShift(this.props.shift)}>
            <FontAwesomeIcon icon="trash"/>
          </button>}
        </div>
        <div className="rota-off-floor">
          {!this.props.editingDisabled &&
          <button className="rota-off-floor-button" type='button' onClick={() => this.props.updateShift(this.props.shift.with({offFloor: !this.props.shift.offFloor}))}>
            <FontAwesomeIcon icon={this.props.shift.offFloor ? "user-secret" : "eye"}/>
          </button>}
        </div>
        <div className="rota-start-time">
          {this.props.editingDisabled ? (
            <div>{this.props.shift.getStartTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input disabled={this.props.editingDisabled}
                   type='time'
                   className="rota-time-input"
                   value={this.props.shift.inputs.startTime.time}
                   onChange={ev => this.startTimeHandler(ev.target.value, this.props.shift)}
            />
          )}
        </div>
        <div className="rota-end-time">
          {this.props.editingDisabled ? (
            <div>{this.props.shift.getEndTime().format(DateFormats.TIME_LEADING_ZERO)}</div>
          ) : (
            <input type='time'
                   className="rota-time-input"
                   value={this.props.shift.inputs.endTime.time}
                   onChange={ev => this.endTimeHandler(ev.target.value, this.props.shift)}
            />
          )}
        </div>
        {(this.props.editingDisabled || this.props.editType === ShiftRecordingTypes.ROTA) && <div className="rota-breaks">{this.props.shift.totalBreaks} hrs</div>}
        {(!this.props.editingDisabled && this.props.editType === ShiftRecordingTypes.SIGN_IN) && <div className="rota-breaks"><input className={`rota-breaks-input`} value={this.props.shift.inputs.totalBreaks} onChange={ev => this.props.updateShift(this.props.shift.with({totalBreaks: ev.target.value}))}/></div>}
        <div className={`rota-rate`}>
          {this.props.rotaShowRates && <input className={`rota-rate-input`}
                                                      disabled={this.props.editingDisabled}
                                                      type="tel" pattern={currencyPattern}
                                                      value={this.props.shift.inputs.hourlyRate}
                                                      onChange={ev => this.props.updateShift(this.props.shift.with({hourlyRate: ev.target.value}))} />}
        </div>
        {this.props.timePeriods.map((timePeriod, periodKey) => (
          <DnDRotaTime key={periodKey} timePeriodIndex={periodKey} shiftStartIndex={shiftStartIndex} shiftEndIndex={shiftEndIndex} isWorking={this.props.shift.isWorkingAtTime(timePeriod)} updateRota={(s,e) => this.dndTimeHandler(this.props.shift, s,e)} shift={this.props.shift} />
        ))}
      </div>
    );
  }

  private dndTimeHandler(shift: Shift, startTime: moment.Moment, endTime: moment.Moment) {
    if (startTime.format(DateFormats.TIME_LEADING_ZERO) !== shift.startTime || endTime.format(DateFormats.TIME_LEADING_ZERO) !== shift.endTime) {
      this.props.updateShift(shift.with({
        startTime: {
          date: startTime.format(DateFormats.API_DATE),
          time: startTime.format(DateFormats.TIME_LEADING_ZERO)
        },
        endTime: {date: endTime.format(DateFormats.API_DATE), time: endTime.format(DateFormats.TIME_LEADING_ZERO)},
        totalBreaks: this.getExpectedBreaks(startTime, endTime).toString(),
      }));
    }
  }

  private startTimeHandler(value: string, shift: Shift) {
    const time = getShiftStartTimeFromStrings(value, shift.date);
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrAfter(shift.getEndTime())) {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, endTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    } else {
      this.props.updateShift(shift.with({startTime: {date: shift.date, time: value}, totalBreaks: this.getExpectedBreaks(time, shift.getEndTime()).toString()}));
    }
  }

  private endTimeHandler(value: string, shift: Shift) {
    const time = getShiftEndTimeFromStrings(value, shift.date);
    const formattedTime = time.format(`HH:mm`);
    if (time.isSameOrBefore(shift.getStartTime())) {
      this.props.updateShift(shift.with({endTime: {date: time.format(DateFormats.API_DATE), time: value}, startTime: {date: shift.date, time: formattedTime}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    } else {
      this.props.updateShift(shift.with({endTime: {date: time.format(DateFormats.API_DATE), time: value}, totalBreaks: this.getExpectedBreaks(shift.getStartTime(), time).toString()}));
    }
  }

  private getExpectedBreaks(startTime: moment.Moment, endTime: moment.Moment): number {
    const hoursDifference = endTime.diff(startTime, "hours");
    if (this.props.workType === WorkTypes.BAR) {

      if (hoursDifference > this.props.constants.hoursPerLongBreak) {
        return this.props.constants.longBreakDuration;
      }
      if (hoursDifference > this.props.constants.hoursPerShortBreak) {
        return this.props.constants.shortBreakDuration;
      }
    } else if (this.props.workType === WorkTypes.KITCHEN) {
      if (hoursDifference > this.props.constants.kitchenHoursPerLongBreak) {
        return this.props.constants.kitchenLongBreakDuration;
      }
      if (hoursDifference > this.props.constants.kitchenHoursPerShortBreak) {
        return this.props.constants.kitchenShortBreakDuration;
      }
    }
    return 0;
  }
}

export const StaffedShift = ShiftComponent;